import {
  PIVOTAL_ENTITY_KIND,
  PIVOTAL_STORY_STATE,
  PIVOTAL_STORY_TYPE,
  PIVOTAL_STORY_TYPE_CONFIG
} from "@src/constants/pivotal";
import { ValueOfKeys } from "@src/types/helpers";

export type PivotalStoryType = keyof typeof PIVOTAL_STORY_TYPE;
export type PivotalStoryState = keyof typeof PIVOTAL_STORY_STATE;
export type PivotalStoryTypeConfig = ValueOfKeys<typeof PIVOTAL_STORY_TYPE_CONFIG>;

// https://www.pivotaltracker.com/help/api/rest/v5#story_transition_resource
export type PivotalStoryTransition = {
  state: PivotalStoryState;
  story_id: number;
  project_id: number;
  project_version: number;
  occurred_at: string; //date
  performed_by_id: number;
  kind: PIVOTAL_ENTITY_KIND.story_transition;
};

export type PivotalCycleTimeDetails = {
  total_cycle_time: number;
  started_time: number;
  started_count: number;
  finished_time: number;
  finished_count: number;
  delivered_time: number;
  delivered_count: number;
  rejected_time: number;
  rejected_count: number;
  story_id: number;
  kind: PIVOTAL_ENTITY_KIND.cycle_time_details;
};

// https://www.pivotaltracker.com/help/api/rest/v5#story_resource
export type PivotalStory = {
  id: number;
  project_id: number;
  name: string;
  description: string;
  story_type: PivotalStoryType;
  current_state: PivotalStoryState;
  estimate: number;
  accepted_at: string; //date
  deadline: string; //date
  projected_completion: string; //date
  points_accepted: number;
  points_total: number;
  counts_accepted: number;
  counts_total: number;
  requested_by_id: number;
  owner_ids: number[];
  label_ids: number[];
  task_ids: number[];
  pull_request_ids: number[];
  branch_ids: number[];
  blocker_ids: number[];
  follower_ids: number[];
  comment_ids: number[];
  created_at: string; //date
  updated_at: string; //date
  before_id: number;
  after_id: number;
  integration_id: number;
  external_id: string;
  url: string;
  transitions: PivotalStoryTransition[];
  blocked_story_ids: number[];
  cycle_time_details: PivotalCycleTimeDetails[];
  kind: PIVOTAL_ENTITY_KIND.story;
};