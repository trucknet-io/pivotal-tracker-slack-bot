import { MessageAttachment } from "@slack/client";
import { SLACK_EVENT_SUBTYPE, SLACK_EVENT_TYPE } from "@src/constants/slack";

export type SlackEventType = keyof typeof SLACK_EVENT_TYPE;
export type SlackEventSubtype = keyof typeof SLACK_EVENT_SUBTYPE;

export type SlackTimeStamp = string;
export type SlackChannelId = string;
export type SlackUserId = string;

export type SlackReaction = {
  name: string;
  count: number;
  users: SlackUserId[];
};

export type SlackAttachment = MessageAttachment;

export type SlackEvent = {
  type: SlackEventType;
  subtype?: SlackEventSubtype;
  hidden?: boolean;
  channel: SlackChannelId;
  user: SlackUserId;
  text?: string;
  ts: SlackTimeStamp;
  deleted_ts?: SlackTimeStamp;
  event_ts?: SlackTimeStamp;
  edited?: {
    user: SlackUserId;
    ts: SlackTimeStamp;
  };
  is_starred?: boolean;
  pinned_to?: SlackChannelId[];
  reactions?: SlackReaction[];
  attachments?: SlackAttachment[];
};
