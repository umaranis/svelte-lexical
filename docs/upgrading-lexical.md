# Upgrading to the latest version of Lexical

- Change lexical version number in package.json (include lexical sub-modules)
- Run `pnpm install`
- Run and test all the demos
- Copy unit tests over from the latest version of lexical playground package (`__tests__` folder)
- Change the port number in `utils/index.mjs`
- Update files in playground project (css, config etc.)
- Update files in svelte-lexical project (plugins etc.)

# Tips for porting from react to svelte

- Change `onEvent` to `on:event`. For instance, `onClick` to `on:click`.
- Change `className` to `class`
- Convert JSX script-accessible properties to content properties. For instance, `htmlFor` to `for` for label element
- Use svelte's `bind:value` instead of onChange events for binding a value to an input control
- See [joshnuss/react-hooks-in-svelte: React hook examples ported to Svelte](https://github.com/joshnuss/react-hooks-in-svelte)
- See [Compoment Party](https://component-party.dev)
- For converting `React.CreatePortal`, see [https://github.com/sveltejs/svelte/issues/3088](https://github.com/sveltejs/svelte/issues/3088)