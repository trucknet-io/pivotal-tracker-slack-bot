import { SLACK_EVENT_TYPE } from "@src/constants/slack";
import { SlackEvent, SlackEventType } from "@src/types";
import { GOOD_IDS } from "@src/utils/tests/pivotal";

export function getFakeSlackEvent(override?: Partial<SlackEvent>): SlackEvent {
  const [i1, i2, i3] = GOOD_IDS;
  return {
    channel: "CFEPT8SUU",
    text: `Take a look these stories: #${i1}, #${i2}, #${i3}`,
    ts: "1547983809.002900",
    type: SLACK_EVENT_TYPE.message as SlackEventType,
    user: "UF911EV7Y",
    ...override,
  };
}

export const BOT_MESSAGE_TS = "1547983811.002901";
