export const PIVOTAL_STORY_TYPE = {
  bug: "bug",
  chore: "chore",
  feature: "feature",
  release: "release",
};

export const PIVOTAL_STORY_STATE = {
  accepted: "accepted",
  delivered: "delivered",
  finished: "finished",
  planned: "planned",
  rejected: "rejected",
  started: "started",
  unscheduled: "unscheduled",
  unstarted: "unstarted",
};

export enum PIVOTAL_ENTITY_KIND {
  cycle_time_details = "cycle_time_details",
  story = "story",
  story_transition = "story_transition",
}

export const PIVOTAL_STORY_TYPE_CONFIG = {
  [PIVOTAL_STORY_TYPE.bug]: {
    emoji: ":beetle:",
    title: "Bug",
  },
  [PIVOTAL_STORY_TYPE.chore]: {
    emoji: ":gear:",
    title: "Chore",
  },
  [PIVOTAL_STORY_TYPE.feature]: {
    emoji: ":star:",
    title: "Feature",
  },
  [PIVOTAL_STORY_TYPE.release]: {
    emoji: ":checkered_flag:",
    title: "Release",
  },
};

export const DESCRIPTION_LENGTH = 50;
