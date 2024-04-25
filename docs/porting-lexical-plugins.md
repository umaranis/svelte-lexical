# Port plugins from Lexical (react) to Svelte-Lexical

When porting a plugin, typically there are two key files you have to look for in the lexical project: 
- Node class (contains properties and functions for a custom lexical node)
- Plugin class (plugs the custom node into the lexical editor by handling the relevant events and user interactions)

These files are typically found in the following directories in the lexical project:
- Node:  `lexical/packages/lexical-playground/src/nodes`
- Plugin: `lexical/packages/lexical-playground/src/plugins`

Next, we have to port these files from `react` to `svelte` and place them in the following folder in the `svelte-lexical` project: `svelte-lexical/packages/svelte-lexical/src/core/plugins/<componentName>`

The last step is to include the Node and Plugin of the new component into the `RichTextComposer` (svelte-lexical/packages/svelte-lexical/src/components/richtext/RichTextComposer.svelte).

A good sample PR would be #50(Hashtag plugin) submitted by @PaddiM8 for Hashtag plugin. 

# Tips for porting from react to svelte

- Change `onEvent` to `on:event`. For instance, `onClick` to `on:click`.
- Change `className` to `class`
- Convert JSX script-accessible properties to content properties. For instance, `htmlFor` to `for` for label element
- Use svelte's `bind:value` instead of onChange events for binding a value to an input control
- See [joshnuss/react-hooks-in-svelte: React hook examples ported to Svelte](https://github.com/joshnuss/react-hooks-in-svelte)
- See [Compoment Party](https://component-party.dev)
- For converting `React.CreatePortal`, see [https://github.com/sveltejs/svelte/issues/3088](https://github.com/sveltejs/svelte/issues/3088)
