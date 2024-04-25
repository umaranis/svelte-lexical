# Upgrading to the latest version of Lexical

- Change lexical version number in package.json (include lexical sub-modules)
- Run `pnpm install`
- Run and test all the demos
- Copy unit tests over from the latest version of lexical playground package (`__tests__` folder)
- Change the port number in `utils/index.mjs`
- Update files in playground project (css, config etc.)
- Update files in svelte-lexical project (plugins etc.)
