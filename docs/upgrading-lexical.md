# Upgrading to the latest version of Lexical
- Change lexical version number in package.json (include lexical sub-modules)
- Run <code>pnpm install</code>
- Run and test all the demos
- Copy unit tests over from the latest version of lexical playground package (`__tests__` folder)
- Change the port number in `utils/index.mjs`
- Update files in playground project (css, config etc.)
- Update files in svelte-lexical project (plugins etc.)

# Tips for porting from react to svelte
- Change `onClick` to `on:click`
- Change `className` to `class`
- See [joshnuss/react-hooks-in-svelte: React hook examples ported to Svelte](https://github.com/joshnuss/react-hooks-in-svelte)
- See [Compoment Party](https://component-party.dev)