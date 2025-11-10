# Creating NPM package

## GitHub action

`.github/workflows/npm-publish.yaml` automatically publishes a new package on creation of release on GitHub.

It uses NPM to build and publish (PNPM is not used due to a bug).

## Steps for creating a new release

- bump up the version number
  - increment the version number for svelte-lexical package
  - for demos project, update version number for `svelte-lexical` dependency in `package.json` (find and replace)
  - run `pnpm i`
  - build all projects
  - commit and push changes
- create a tag in GitHub
  - add release notes
  - it will automatically trigger GitHub action for creating a package

# Commit Messages

Please use the following tags in your commit message:

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
