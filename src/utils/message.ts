import { MessageAttachment } from "@slack/client";
import { DESCRIPTION_LENGTH, PIVOTAL_STORY_TYPE_CONFIG } from "@src/constants/pivotal";
import { PivotalStory, PivotalStoryTypeConfig, SlackEvent } from "@src/types";

export function extractPivotalIds(message: SlackEvent): string[] {
  const ids = message.text && message.text.match(/\#\d{9}/gim);
  if (!ids) {
    return [];
  }
  return ids.map((id) => id.replace("#", ""));
}

export function convertStoryToAttachment(story: PivotalStory): MessageAttachment {
  const { description, estimate, id, name, story_type, url } = story;
  const { emoji, title }: PivotalStoryTypeConfig = PIVOTAL_STORY_TYPE_CONFIG[story_type];

  const storyType = `${emoji} *${title}*`;
  const difficulty = estimate ? `: \`${estimate}\` _points_` : "";
  const descriptionCut =
    DESCRIPTION_LENGTH && description
      ? description.slice(0, DESCRIPTION_LENGTH).replace(/(\n|\r)/gim, " ") +
        (description.length > DESCRIPTION_LENGTH ? "..." : "")
      : "";

  return {
    color: "#e25d05",
    fallback: `${title}: ${name}`,
    footer: `#${id}`,
    text: `${storyType}${difficulty}\n${descriptionCut}`,
    title: name,
    title_link: url,
  };
}
