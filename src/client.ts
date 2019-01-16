import { RTMClient, WebClient } from "@slack/client";
import debug from "debug";

const log = debug("pivotal:client");

export class Client {
  private readonly token: string;
  private readonly rtm: RTMClient;
  private readonly web: WebClient;

  constructor() {
    this.token = process.env.SLACK_API_TOKEN || "";
    if (!this.token) {
      log("You must specify a token to use this example");
      process.exit(1);
    }

    this.rtm = new RTMClient(this.token);
    this.web = new WebClient(this.token);
  }

  public start() {
    this.rtm.start();

    this.rtm.on("message", (event) => {
      log(`Message`, JSON.stringify(event, undefined, 2));
      if (event.subtype !== "bot_message") {
        this.web.chat.unfurl({
          channel: event.channel,
          ts: event.ts,
          unfurls: {
            lol: {
              "fallback": "Required plain-text summary of the attachment.",
              "color": "#2eb886",
              "pretext": "Optional text that appears above the attachment block",
              "author_name": "Bobby Tables",
              // tslint:disable-next-line
              "author_link": "http://flickr.com/bobby/",
              // tslint:disable-next-line
              "author_icon": "http://flickr.com/icons/bobby.jpg",
              "title": "Slack API Documentation",
              "title_link": "https://api.slack.com/",
              "text": "Optional text that appears within the attachment",
              "fields": [
                {
                  "title": "Priority",
                  "value": "High",
                  "short": false
                }
              ],
              // tslint:disable-next-line
              "image_url": "http://my-website.com/path/to/image.jpg",
              // tslint:disable-next-line
              "thumb_url": "http://example.com/path/to/thumb.png",
              "footer": "Slack API",
              "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
            }
          }
        });
      }
    });
  }
}

export default Client;
