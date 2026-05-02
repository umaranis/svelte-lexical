# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

svelte-lexical is a rich-text editor library for Svelte 5, built on top of Meta's [Lexical](https://lexical.dev/) editor framework. It provides Svelte bindings for Lexical and high-level editor components. The repo is a pnpm monorepo with the main library at `packages/svelte-lexical` and several demo apps under `demos/`.

## Commands

All commands use `pnpm`. The workspace root has no runnable scripts; commands must target a package with `-C <path>`.

### Library (`packages/svelte-lexical`)

```bash
pnpm -C packages/svelte-lexical build       # build the library (outputs to dist/)
pnpm -C packages/svelte-lexical dev         # dev server for the package's example page
pnpm -C packages/svelte-lexical check       # svelte-check type checking
pnpm -C packages/svelte-lexical lint        # prettier check + eslint
pnpm -C packages/svelte-lexical format      # auto-format with prettier
pnpm -C packages/svelte-lexical test        # run unit tests (vitest)
pnpm -C packages/svelte-lexical test:watch  # vitest in watch mode
```

### Demos

```bash
pnpm -C demos/playground dev                # run the full-featured playground demo
pnpm -C demos/sveltekit dev                 # run the SvelteKit demo
```

### E2E Tests (Playwright, run from `demos/playground`)

```bash
# Start dev server first in a separate terminal:
pnpm -C demos/playground dev

# Then from demos/playground:
cd demos/playground
pnpm test-e2e-chromium                      # run all e2e tests in chromium
pnpm playwright test --ui                   # Playwright UI mode (recommended for dev)
npx playwright test --debug                 # run with Playwright Inspector

# Collaboration tests require the collab server:
pnpm collab                                 # start y-websocket server
pnpm test-e2e-collab-chromium              # run collab tests
```

## Architecture

### Monorepo Structure

- `packages/svelte-lexical/` — the publishable npm library (`svelte-lexical`)
- `packages/website/` — Astro-based documentation website
- `demos/playground/` — full-featured demo app with E2E tests; the canonical reference implementation
- `demos/playground-lite/`, `demos/richtext-editor/`, `demos/plaintext-editor/`, `demos/sveltekit/` — minimal demo apps

### Core Concepts

**Composer** (`src/lib/core/Composer.svelte`) is the root component that initializes the Lexical editor and provides it via Svelte context. All plugins must be rendered as descendants of `<Composer>`. The editor instance is accessed in any child component via `getEditor()` from `composerContext.ts`.

**Context system** (`src/lib/core/composerContext.ts`) — the bridge between Composer and plugins. Key context keys: `editor` (the `LexicalEditor`), `isEditable`, `activeEditor`, `historyState`, `blockType`, `fontSize`, `isBold`, `isLink`. Plugins call `getEditor()` to get the editor and register Lexical listeners in `onMount`.

**Plugin pattern** — a plugin is a `.svelte` component with no visible output. It calls `getEditor()` on init, then uses `onMount` to register Lexical command listeners/update listeners, and returns the cleanup function (Lexical listeners return their own unregisters).

```svelte
<script lang="ts">
  import {onMount} from 'svelte';
  import {getEditor} from '../composerContext.js';
  const editor = getEditor();
  onMount(() => {
    return editor.registerUpdateListener(({editorState}) => { /* ... */ });
  });
</script>
```

**DecoratorNode pattern** — used for rich embedded content (images, YouTube, Twitter/X, Bluesky, columns layout). Each feature has two files: a `*Node.ts` extending `DecoratorNode` (or `DecoratorBlockNode` for block-level) and a `*Component.svelte` for its UI. The `decorate()` method returns `{componentType, props}` rather than a React element. Nodes that have no mutable props can skip the decorator mechanism by setting `static skipDecorateRender = true` and returning `null` from `decorate()`. See `docs/decorator-node.md` for detailed internals.

**`DecoratorBlockNode`** (`src/lib/core/plugins/DecoratorBlockNode.ts`) — base class for block-level embedded nodes (YouTube, Tweet, Bluesky, columns). Extend this instead of `DecoratorNode` directly when the node should be block-level and alignable.

**`NestedComposer`** (`src/lib/core/NestedComposer.svelte`) — creates a nested Lexical editor (e.g., image captions). Uses the same plugin model; requires its own history plugin (use `CaptionEditorHistoryPlugin` or `CaptionEditorCollaborationPlugin`).

**`nodeSelectionStore`** (`src/lib/core/nodeSelectionStore.ts`) — svelte store wrapper around Lexical node selection. Used in decorator components to reactively track whether their node is selected.

**`editorExtensions`** (`src/lib/core/editorExtensions.ts`) — augments `LexicalEditor` with an `extensions` object that dialog-opening functions are attached to (`openInsertImageDialog`, etc.). Lets toolbar buttons trigger dialogs that live elsewhere in the tree.

### Themes

Three built-in themes are exported as separate package entry points:

- `svelte-lexical/dist/themes/default` — default theme
- `svelte-lexical/dist/themes/light-dark` — light/dark mode (CSS variables)
- `svelte-lexical/dist/themes/system-light-dark` — follows OS preference

Each theme exports two objects: an `EditorThemeClasses` object (passed to `Composer initialConfig.theme`) and a shell theme (CSS classes for toolbar, dialogs, etc). Shell CSS must be imported separately.

### Package Exports

The library has two main entry points:
- `svelte-lexical` — all plugins, nodes, toolbar components, commands, and utilities
- `svelte-lexical/shiki` — optional Shiki-based code syntax highlighting (tree-shakable, heavy dependency)

### Adding a New Plugin

1. Create `src/lib/core/plugins/<FeatureName>/` with a `FeatureNode.ts` and `FeaturePlugin.svelte`
2. Register the node in `RichTextComposer.svelte` (the `nodes` array in `initialConfig`)
3. Add `<FeaturePlugin />` inside `<Composer>` in `RichTextComposer.svelte`
4. Export both from `src/lib/index.ts`

When porting from React Lexical: React JSX handlers like `onClick` become `onclick`, `className` becomes `class`, `htmlFor` becomes `for`. Use `bind:value` instead of onChange for inputs. See `docs/porting-lexical-plugins.md`.

### Testing

- **Unit tests**: Vitest + Testing Library. Files named `*.svelte.test.ts` run in jsdom environment. Run with `pnpm -C packages/svelte-lexical test`.
- **E2E tests**: Playwright in `demos/playground/src/__tests__/`. Tests run against the built playground app. The CI workflow picks up the published npm package; local runs use the local build.

## Code Conventions

- **Svelte 5 runes**: The codebase uses Svelte 5 with `$props()`, `$state()`, `$derived()`. Do not use the legacy store/reactive syntax for new components.
- **TypeScript**: Strict mode. Use `import type` for type-only imports.
- **Prettier config**: single quotes, no bracket spacing, trailing commas, 80 char print width. Svelte files use the svelte prettier parser.
- **ESLint**: `no-console` and `no-debugger` are errors. `@ts-ignore` is allowed only with a description comment.
- **Commit message tags**: `feat`, `minor`, `bug`, `test`, `build`, `perf`, `refactor`, `docs`. Reference issues with `#N`; close with `fix #N` or `close #N`.
- **`<!-- svelte-ignore state_referenced_locally -->`**: This suppression comment appears at the top of components that reference `$state` variables at module initialization time. It's a known Svelte 5 pattern used throughout the codebase.
- Lexical functions that operate inside `editor.read()` or `editor.update()` callbacks are prefixed with `$` by Lexical convention (e.g., `$getRoot`, `$createParagraphNode`). When importing these, aliasing without the `$` prefix is common for use in Svelte templates.
