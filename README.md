# Pivotal Tracker Slack Bot

Slack bot for Pivotal Tracker integration

## Start

`npm run build` to build js, `npm start` to start

## Tests

`npm test` to launch all tests.

Unit tests should be near the file with `.spec.ts` extension.
Integration tests should be in **tests**

## Release

`npm test patch/minor/major` will start a release/ branch (using git flow), edit package.json (and lock) to update the version, commit, finish the release and push including all branches and tags
