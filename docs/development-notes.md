# Testing

- Unit testing is set up for svelte-lexical package using Jest and Testing Library
  - pnpm -C packages\svelte-lexical test
- E2E testing is set up for playground package using playwright
  - pnpm -C demos\playground playwright test
  - Also setup in Github Actions
  - In Github Actions, it picks up the latest version of svelte-lexical from npm, so dependent on that being updated (running locally picks the latest local changes though)
  - test results are uploaded to GitHub Actions artifacts