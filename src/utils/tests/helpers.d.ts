import { RTMClient } from "@slack/client";
import { SlackEvent } from "@src/types";

export interface IFakeRtmClient extends RTMClient {
  mockEvent?: Partial<SlackEvent>;
}
