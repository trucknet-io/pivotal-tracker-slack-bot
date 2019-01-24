import { RTMClient, WebClient } from "@slack/client";
import { SLACK_EVENT_SUBTYPE, SLACK_EVENT_TYPE } from "@src/constants/slack";
import { PivotalStory, SlackEvent } from "@src/types";
import { convertStoryToAttachment, extractPivotalIds } from "@src/utils/message";
import axios, { AxiosInstance } from "axios";
import debug from "debug";

const log = debug("pivotal:client");

export type ClientEnv = {
  PIVOTAL_API_TOKEN: string;
  SLACK_API_TOKEN: string;
};

export interface IClientEvents {
  onBotMessage(e?: SlackEvent): void;
  onNoIdsFound(e?: SlackEvent, ids?: number[]): void;
  onNoStoriesFound(e?: SlackEvent, ids?: number[]): void;
  onBeforeStoriesPosted(update: Partial<SlackEvent>): void;
}

export class Client implements IClientEvents {
  public onBotMessage: IClientEvents["onBotMessage"];
  public onNoIdsFound: IClientEvents["onNoIdsFound"];
  public onNoStoriesFound: IClientEvents["onNoStoriesFound"];
  public onBeforeStoriesPosted: IClientEvents["onBeforeStoriesPosted"];

  protected readonly slackToken: string;
  protected readonly pivotalToken: string;
  protected readonly rtm: RTMClient;
  protected readonly web: WebClient;
  protected readonly axios: AxiosInstance;

  constructor({
    env = process.env as ClientEnv,
    onBotMessage = () => false,
    onNoIdsFound = () => false,
    onNoStoriesFound = () => false,
    onBeforeStoriesPosted = () => false,
  }: { env?: ClientEnv } & Partial<IClientEvents> = {}) {
    this.slackToken = env.SLACK_API_TOKEN || "";
    this.pivotalToken = env.PIVOTAL_API_TOKEN || "";
    if (!this.slackToken || !this.pivotalToken) {
      log("You must specify Slack and Pivotal tokens to use this bot");
      process.exit(1);
    }

    this.rtm = new RTMClient(this.slackToken);
    this.web = new WebClient(this.slackToken);
    this.axios = axios.create({
      headers: {
        "X-TrackerToken": this.pivotalToken,
      },
    });

    this.onBotMessage = onBotMessage;
    this.onNoIdsFound = onNoIdsFound;
    this.onNoStoriesFound = onNoStoriesFound;
    this.onBeforeStoriesPosted = onBeforeStoriesPosted;
  }

  public start() {
    this.rtm.start().catch((err) => {
      log(`Could not start RTMClient`, err);
    });
    this.rtm.on(SLACK_EVENT_TYPE.message, this.handleMessageEvent);
  }

  protected handleMessageEvent = async (event: SlackEvent) => {
    if (event.subtype === SLACK_EVENT_SUBTYPE.bot_message) {
      this.onBotMessage(event);
      return;
    }
    const ids = extractPivotalIds(event);

    if (!ids.length) {
      this.onNoIdsFound(event, ids);
      return;
    }

    log(`Extracted ids: `, ids, `\nFrom message: `, event);

    const [loadingMsg, stories] = await Promise.all([
      this.rtm.sendMessage(`Loading ${ids.length > 1 ? "stories" : "story"}...`, event.channel),
      this.fetchPivotalStories(ids),
    ]);

    log(`Got stories: `, stories);

    if (!stories.length) {
      await this.web.chat.delete({
        channel: event.channel,
        ts: loadingMsg.ts,
      });
      this.onNoStoriesFound(event, ids);
      return;
    }

    return this.postStoriesToSlack({ channel: event.channel, ts: loadingMsg.ts }, stories);
  };

  protected async fetchPivotalStories(ids: number[]): Promise<PivotalStory[]> {
    const requests = ids.map((id) =>
      this.axios
        .get<PivotalStory>(`https://www.pivotaltracker.com/services/v5/stories/${id}`)
        .then((res) => res.data)
        .catch(() => undefined),
    );
    const stories = await Promise.all(requests);
    return stories.filter(Boolean) as PivotalStory[];
  }

  protected async postStoriesToSlack(options: { channel: string; ts: string }, stories: PivotalStory[]) {
    const update = {
      attachments: stories.map(convertStoryToAttachment),
      text: "",
      ...options,
    };
    this.onBeforeStoriesPosted(update);
    return this.web.chat.update(update);
  }
}

export default Client;
