[![Build](https://github.com/umaranis/svelte-lexical/actions/workflows/build.yml/badge.svg)](https://github.com/umaranis/svelte-lexical/actions/workflows/build.yml)

# svelte-lexical

A rich-text editor for Svelte based on [Lexical](https://lexical.dev/)

Lexical is an extensible text editor framework developed by awesome developers at Facebook. The purpose of this project is to provide Svelte bindings for Lexical and also develop high-level components using Lexical.

![Screenshot-Svelte-Lexical](docs/images/Screenshot-Svelte-Lexical.jpg)

## Development Notes
- This project is set up as a monorepo using pnpm workspaces.
- To run a demo in development, execute <code>pnpm -C demos/playground dev</code>.
- ESLint is set up for VS Code.
- The npm package is automatically published on creation of a GitHub release using GitHub Actions.
- Unit testing is set up for the svelte-lexical package using Jest and Testing Library.
- E2E testing is set up for the playground package using Playwright.
- [Size Limit](https://github.com/ai/size-limit) controls the library size.
