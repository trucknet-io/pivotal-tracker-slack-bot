import { PIVOTAL_STORY_TYPE } from "@src/constants/pivotal";
import { PivotalStoryType } from "@src/types";
import { getFakePivotalStory } from "@src/utils/tests/pivotal";
import { getFakeSlackEvent } from "@src/utils/tests/slack";
import { convertStoryToAttachment, extractPivotalIds } from "./message";

describe("extractPivotalIds", () => {
  test("extracts array of Pivotal story IDs from SlackEvent", () => {
    const message = getFakeSlackEvent();
    const ids = extractPivotalIds(message);
    expect(ids).toEqual(["123456789", "234567890"]);
  });

  test("returns empty array if no IDs found", () => {
    const message1 = getFakeSlackEvent({ text: "Hey!" });
    const ids1 = extractPivotalIds(message1);
    expect(ids1).toEqual([]);

    const message2 = getFakeSlackEvent({ text: undefined });
    const ids2 = extractPivotalIds(message2);
    expect(ids2).toEqual([]);
  });
});

describe("convertStoryToAttachment", () => {
  test("converts Pivotal feature to Slack's MessageAttachment", () => {
    const story = getFakePivotalStory();
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
    const story = getFakePivotalStory({
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
    const story = getFakePivotalStory({
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
