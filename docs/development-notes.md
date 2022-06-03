# Testing

- Unit testing is set up for svelte-lexical package using Jest and Testing Library
  - pnpm -C packages\svelte-lexical test
- E2E testing is set up for playground package using playwright
  - pnpm -C demos\playground playwright test
  - Also setup in Github Actions
  - In Github Actions, it picks up the latest version of svelte-lexical from npm, so dependent on that being updated (running locally picks the latest local changes though)
  - test results are uploaded to GitHub Actions artifacts

# Creating NPM package

## GitHub action
<code>.github/workflows/npm-publish.yaml</code> automatically publishes a new package on creation of release on GitHub.

## Updating the package-lock.json

> This step has to be performed before creating the release on GitHub.

The project is using PNPM for build. PNPM uses pnpm-lock.yaml file for recording exact versions of dependencies, while NPM use package-lock.json

Due to an PNPM bug, the GitHub action for creating packages uses NPM. This requires the package-lock.json to be up to date.

Use the following command to generate/update package-lock.json: <code>npm i --package-lock-only</code>

## Clearing NPM caache

This step is only required if you are getting the following error: `npm ERR! code EINTEGRITY`

`npm cache clean --force`