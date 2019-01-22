# Pivotal Tracker Slack Bot

[Slack](https://www.slack.com) bot for integration with
[Pivotal Tracker](https://www.pivotaltracker.com).  

## Overview

This Slack bot listens for messages with Pivotal story IDs(which look like
**#123456789**), fetches appropriate stories from Pivotal Tracker and posts 
them as a nice message in Slack.  
  
![](pivotal-slack-bot.gif)

## Installation

1. Create `.env` file and put it in project's root folder.
1. [Create your Slack app and add bot into it](https://api.slack.com/bot-users).
1. Install your app to your workspace.
1. Got to the *Features -> OAuth & Permissions* tab and copy **Bot User OAuth 
Access Token**. Paste it as 
`SLACK_API_TOKEN=your-slack-token-goes-here` in the `.env` file.
1. Go to your [Pivotal profile](https://www.pivotaltracker.com/profile), 
find *API TOKEN* section, copy your **API token** and paste it as 
`PIVOTAL_API_TOKEN=your-pivotal-token-goes-here`.
Your `.env` file should look something like this:
    ```
    SLACK_API_TOKEN=xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx  
    PIVOTAL_API_TOKEN=aaaaaaaaaabbbbbbbbbbffffffffff00
    ```
1. Run `npm install` and that's it.

*Note: instead of creating `.env` file you can pass `SLACK_API_TOKEN` and 
`PIVOTAL_API_TOKEN` as Node.js env variables*.

## Start

`npm run build` to build js  
`npm start` to start  
`npm run start:dev` to watch for file changes and restart bot instance  

## Tests

`npm test` to launch all tests.

Unit tests should be near the file with `.spec.ts` extension.
Integration tests should be in **tests**.

## Release

`npm test patch/minor/major` will start a release/ branch (using git flow),
 edit package.json (and lock) to update the version, commit, finish 
 the release and push including all branches and tags.
 
 
