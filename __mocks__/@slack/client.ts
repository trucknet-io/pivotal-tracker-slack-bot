import { SlackEvent } from "@src/types";
import { BOT_MESSAGE_TS, mockSlackEvent } from "@src/utils/tests/slack";

export class RTMClient {
  public token: string;
  public mockEvent: SlackEvent;

  constructor(token: string) {
    this.token = token;
    this.mockEvent = mockSlackEvent();
  }

  public start() {
    return Promise.resolve(true);
  }

  public on(type: string, handler: (event: SlackEvent) => void) {
    handler(this.mockEvent);
    return this;
  }

  public sendMessage(text: string, channel: string): Promise<Object> {
    return Promise.resolve({
      channel: this.mockEvent.channel,
      ts: BOT_MESSAGE_TS,
    });
  }
}

export class WebClient {
  public token: string;
  public chat = {
    delete: (options: Object) => Promise.resolve(options),
    update: (options: Object) => Promise.resolve(options),
  };

  constructor(token: string) {
    this.token = token;
  }
}
