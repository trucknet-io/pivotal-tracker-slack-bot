import { PIVOTAL_STORY_TYPE } from "@src/constants/pivotal";
import { SLACK_EVENT_SUBTYPE } from "@src/constants/slack";
import { PivotalStoryType, SlackEvent, SlackEventSubtype } from "@src/types";
import { timeout } from "@src/utils/helpers";
import { convertStoryToAttachment } from "@src/utils/message";
import { IFakeRtmClient } from "@src/utils/tests/helpers";
import { BAD_IDS, GOOD_IDS, mockPivotalStory } from "@src/utils/tests/pivotal";
import { BOT_MESSAGE_TS, mockSlackEvent } from "@src/utils/tests/slack";
import jestMockAxios from "jest-mock-axios";
import Client from "./Client";

afterEach(() => {
  // cleaning up the mess left behind the previous test
  jestMockAxios.reset();
});

const fakeEnv = {
  SLACK_API_TOKEN: "fakeSlackToken",
  PIVOTAL_API_TOKEN: "fakePivotalToken",
};

class ClientMock extends Client {
  constructor() {
    super({
      env: fakeEnv,
      onBotMessage: jest.fn(),
      onNoIdsFound: jest.fn(),
      onNoStoriesFound: jest.fn(),
      beforeStoriesPosted: jest.fn(),
    });
  }

  // Use this method to mock Slack message event
  public start(event?: Partial<SlackEvent>) {
    const e = mockSlackEvent(event);
    (this.rtm as IFakeRtmClient).mockEvent = e;
    super.start();
    return e;
  }
}

describe("Client", () => {
  test("skips messages from bots", () => {
    const client = new ClientMock();
    client.start({ subtype: SLACK_EVENT_SUBTYPE.bot_message as SlackEventSubtype });

    expect(client.onBotMessage).toBeCalledTimes(1);
    expect(client.beforeStoriesPosted).not.toBeCalled();
  });

  test("skips messages without ids", () => {
    const client = new ClientMock();
    client.start({ text: "Message without story ID" });

    expect(client.onBotMessage).not.toBeCalled();
    expect(client.onNoIdsFound).toBeCalledTimes(1);
    expect(client.beforeStoriesPosted).not.toBeCalled();
  });

  test("deletes bot's message if no stories fetched", async () => {
    const client = new ClientMock();
    const [i1, i2, i3] = BAD_IDS;
    client.start({ text: `Message with bad IDs: #${i1}, #${i2}, #${i3}` });

    jestMockAxios.mockError();
    jestMockAxios.mockError();
    jestMockAxios.mockError();

    await timeout();

    expect(client.onNoIdsFound).not.toBeCalled();
    expect(client.onNoStoriesFound).toBeCalledTimes(1);
    expect(client.beforeStoriesPosted).not.toBeCalled();
  });

  test("posts fetched stories as Slack message with attachments", async () => {
    const client = new ClientMock();
    const [i1] = BAD_IDS;
    const [v1, v2] = GOOD_IDS;
    const message = client.start({ text: `Message with good and bad IDs: #${v1}, #${i1}, #${v2}` });

    const story1 = mockPivotalStory({ id: v1 });
    const story2 = mockPivotalStory({
      id: v2,
      estimate: undefined,
      story_type: PIVOTAL_STORY_TYPE.bug as PivotalStoryType,
    });

    jestMockAxios.mockResponse({ data: story1 });
    jestMockAxios.mockError();
    jestMockAxios.mockResponse({ data: story2 });

    await timeout();

    expect(client.onNoIdsFound).not.toBeCalled();
    expect(client.onNoStoriesFound).not.toBeCalled();
    expect(client.beforeStoriesPosted).toBeCalledWith({
      attachments: [story1, story2].map(convertStoryToAttachment),
      text: "",
      channel: message.channel,
      ts: BOT_MESSAGE_TS,
    });
  });
});
