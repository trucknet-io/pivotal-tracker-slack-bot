import { RTMClient, WebClient } from "@slack/client";
import { SLACK_EVENT_SUBTYPE, SLACK_EVENT_TYPE } from "@src/constants/slack";
import { PivotalStory, SlackEvent } from "@src/types";
import { convertStoryToAttachment, extractPivotalIds } from "@src/utils/message";
import axios, { AxiosInstance } from "axios";
import debug from "debug";

const log = debug("pivotal:client");

export class Client {
  private readonly slackToken: string;
  private readonly pivotalToken: string;
  private readonly rtm: RTMClient;
  private readonly web: WebClient;
  private readonly axios: AxiosInstance;

  constructor() {
    this.slackToken = process.env.SLACK_API_TOKEN || "";
    this.pivotalToken = process.env.PIVOTAL_API_TOKEN || "";
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
  }

  public start() {
    this.rtm.start().catch((err) => {
      log(`Could not start RTMClient`, err);
    });
    this.rtm.on(SLACK_EVENT_TYPE.message, this.handleMessageEvent);
  }

  private handleMessageEvent = async (event: SlackEvent) => {
    if (event.subtype === SLACK_EVENT_SUBTYPE.bot_message) {
      return;
    }
    const ids = extractPivotalIds(event);

    if (!ids.length) {
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
      return;
    }

    await this.postStoriesToSlack({ channel: event.channel, ts: loadingMsg.ts }, stories);
  };

  private async fetchPivotalStories(ids: string[]): Promise<PivotalStory[]> {
    const requests = ids.map((id) =>
      this.axios
        .get<PivotalStory>(`https://www.pivotaltracker.com/services/v5/stories/${id}`)
        .then((res) => res.data)
        .catch(() => undefined),
    );
    const stories = await Promise.all(requests);
    return stories.filter(Boolean) as PivotalStory[];
  }

  private async postStoriesToSlack(options: { channel: string; ts: string }, stories: PivotalStory[]) {
    return this.web.chat.update({
      attachments: stories.map(convertStoryToAttachment),
      text: "",
      ...options,
    });
  }
}

export default Client;
