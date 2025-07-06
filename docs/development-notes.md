# Testing

## Unit Testing

Unit testing is set up for svelte-lexical package using Jest and Testing Library

- pnpm -C packages/svelte-lexical test

## E2E (end-to-end) Testing

E2E testing is set up for playground package using playwright

Currently, 64 tests are passing.

### Running in VSCode

Run from VSCode `Testing` pane or click the play button in source code files.

The tests run in headless mode in the background.

### Running locally from CLI

- Start the playground demo
  - `pnpm -C demos/playground dev`
- Move into the project directory
  - `cd demos/playground`
- Run tests
  - All tests (chromium, firefox and safari): `pnpm playwright test`
  - Just chromium browser: `pnpm test-e2e:chromium`

The tests run in headless mode in the background.

### Running in Playwright UI

This is new way of running tests. Following command launches the UI with VSCode like testing pane. We can choose which tests to run from there.

`pn playwright test --ui`

With this UI, Playwright captures screenshots (before and after view) for each of the steps which is the distinguishing feature. It also useful for working with locators.

### Debugging tests

Following are the two options for debugging `testing code`. The `code under test` can be debugged using browser DevTools in both cases.

1. Playwright Inspector

    It is good for working with locators and visually representing clicks and stuff. It lets you step through the test code. But `step into` and `watches` are not supported.  

    Start debugging all Tests

    `npx playwright test --debug`

    Debugging specific tests

    `npx playwright test List --debug`

2. VSCode debugger

    It has full debugging support for test code.

    Only safari debug profile is working in the current setup. Need to fix other profiles (they are working in lexical).

### Running in GitHub Actions

- See .github/tests.yaml
- It picks up the latest version of svelte-lexical from npm, so dependent on that being updated (running locally picks the latest local changes though)
- Test results are uploaded to GitHub Actions artifacts

# Creating NPM package

## GitHub action

`.github/workflows/npm-publish.yaml` automatically publishes a new package on creation of release on GitHub.

It uses NPM to build and publish (PNPM is not used due to a bug).

## Steps for creating a new release

- bump up the version number
  - increment the verion number for svelte-lexical package
  - for demos project, update version number for `svelte-lexical` dependency in `package.json` (find and replace)
  - run `pnpm i`
  - build all projects
  - commit and push changes
- create a tag in GitHub
  - add release notes
  - it will automatically trigger GitHub action for creating a package

# Commit Messages

Please use following tags in your commit message:

- feat (or feature)
- minor
- bug
- test
- build
- perf (or performance)
- refactor
- docs

It is recommended to refer to the issue, for example, #12.
If you want to close the issue, use `fix` or `close`, for example, fix #12.  

### Sample commit message

feat: added functionality for task reminders, close #12
