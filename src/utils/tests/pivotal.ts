import { PIVOTAL_ENTITY_KIND, PIVOTAL_STORY_TYPE } from "@src/constants/pivotal";
import { PivotalStory, PivotalStoryType } from "@src/types";

export function mockPivotalStory(override?: Partial<PivotalStory>): PivotalStory {
  return {
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
  };
}

export const GOOD_IDS = [162529758, 162540278, 163198289];
export const BAD_IDS = [123456789, 234567890, 345678901];
