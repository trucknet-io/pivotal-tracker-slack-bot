import { PIVOTAL_ENTITY_KIND, PIVOTAL_STORY_TYPE } from "@src/constants/pivotal";
import { SLACK_EVENT_TYPE } from "@src/constants/slack";
import { PivotalStory, PivotalStoryType, SlackEvent, SlackEventType } from "@src/types";
import { convertStoryToAttachment, extractPivotalIds } from "./message";

const mockSlackEvent = (override?: Partial<SlackEvent>): SlackEvent => ({
  channel: "CFEPT8SUU",
  text: "Take a look these stories: #123456789, #234567890",
  ts: "1547983809.002900",
  type: SLACK_EVENT_TYPE.message as SlackEventType,
  user: "UF911EV7Y",
  ...override,
});

describe("extractPivotalIds", () => {
  test("extracts array of Pivotal story IDs from SlackEvent", () => {
    const message = mockSlackEvent();
    const ids = extractPivotalIds(message);
    expect(ids).toEqual(["123456789", "234567890"]);
  });

  test("returns empty array if no IDs found", () => {
    const message1 = mockSlackEvent({ text: "Hey!" });
    const ids1 = extractPivotalIds(message1);
    expect(ids1).toEqual([]);

    const message2 = mockSlackEvent({ text: undefined });
    const ids2 = extractPivotalIds(message2);
    expect(ids2).toEqual([]);
  });
});

const mockPivotalStory = (override?: Partial<PivotalStory>): PivotalStory => ({
  kind: PIVOTAL_ENTITY_KIND.story,
  id: 162529758,
  created_at: "2018-12-09T06:33:27Z",
  updated_at: "2019-01-14T10:07:06Z",
  accepted_at: "2019-01-14T10:07:06Z",
  estimate: 5,
  story_type: PIVOTAL_STORY_TYPE.feature as PivotalStoryType,
  name: "Story name",
  description: "Story description...",
  current_state: "accepted",
  requested_by_id: 3125009,
  url: "https://www.pivotaltracker.com/story/show/162529758",
  project_id: 2229825,
  ...override,
});

describe("convertStoryToAttachment", () => {
  test("converts Pivotal feature to Slack's MessageAttachment", () => {
    const story = mockPivotalStory();
    const attachment = convertStoryToAttachment(story);
    expect(attachment).toEqual({
      color: "#e25d05",
      fallback: "Feature: Story name",
      footer: "#162529758",
      text: `:star: *Feature*: \`5\` _points_\nStory description...`,
      title: "Story name",
      title_link: "https://www.pivotaltracker.com/story/show/162529758",
    });
  });

  test("converts Pivotal bug to Slack's MessageAttachment", () => {
    const story = mockPivotalStory({
      estimate: undefined,
      story_type: PIVOTAL_STORY_TYPE.bug as PivotalStoryType,
    });
    const attachment = convertStoryToAttachment(story);
    expect(attachment).toEqual({
      color: "#e25d05",
      fallback: "Bug: Story name",
      footer: "#162529758",
      text: `:beetle: *Bug*\nStory description...`,
      title: "Story name",
      title_link: "https://www.pivotaltracker.com/story/show/162529758",
    });
  });

  test(`cuts description that is longer than 50 chars`, () => {
    const story = mockPivotalStory({
      description: "0123456789\n123456789\r123456789\n\r2345678901234567890123",
      estimate: undefined,
      story_type: PIVOTAL_STORY_TYPE.chore as PivotalStoryType,
    });
    const attachment = convertStoryToAttachment(story);
    expect(attachment).toEqual({
      color: "#e25d05",
      fallback: "Chore: Story name",
      footer: "#162529758",
      text: `:gear: *Chore*\n0123456789 123456789 123456789  234567890123456789...`,
      title: "Story name",
      title_link: "https://www.pivotaltracker.com/story/show/162529758",
    });
  });
});
