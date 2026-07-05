# Qalam

A distraction-free, notes app built with `svelte-lexical`, runnable as a
desktop app (via [Tauri](https://tauri.app/)) or as a plain web app in the
browser.

## Features

- Rich-text notes editor with headings, lists, checklists, links, tables,
  images, code blocks (with syntax highlighting), embeds (YouTube, Twitter,
  Bluesky), and Markdown shortcuts.
- Sidebar for creating, renaming, switching between, and deleting notes.
- Autosave: content is saved automatically shortly after you stop typing.
- Undo/redo history is kept per-note, so switching notes doesn't lose it.
- Storage backend adapts to the environment:
  - Running as a Tauri desktop app: notes are saved as JSON files in the
    app's data directory (see Settings for the exact path).
  - Running in a browser: notes are saved in IndexedDB, local to that
    browser.

## Getting Started

`svelte-lexical` is consumed from the workspace, so build it first:

```sh
cd ../../packages/svelte-lexical
pnpm i
pnpm build
```

Then, from `demos/qalam`:

```sh
pnpm i
```

### Run as a web app

```sh
pnpm dev
```

Opens the app at `http://localhost:5173`, storing notes in the browser's
IndexedDB.

### Run as a desktop app (Tauri)

```sh
pnpm tauri:dev
```

Requires the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)
for your platform to be installed. Notes are stored as JSON files under the
OS-specific app data directory.

### Build

```sh
pnpm build         # web build
pnpm tauri:build    # desktop app bundle
```

## Project Structure

- [src/App.svelte](src/App.svelte) — top-level layout: sidebar + editor.
- [src/lib/Sidebar.svelte](src/lib/Sidebar.svelte) — notes list, create/rename/delete.
- [src/lib/Editor.svelte](src/lib/Editor.svelte) — the `svelte-lexical` editor setup, autosave, and per-note history handling.
- [src/lib/Toolbar.svelte](src/lib/Toolbar.svelte) — formatting toolbar.
- [src/lib/Settings.svelte](src/lib/Settings.svelte) — shows where notes are stored.
- [src/lib/notesStore.svelte.ts](src/lib/notesStore.svelte.ts) — reactive store coordinating notes state with the backend.
- [src/lib/notesBackend.ts](src/lib/notesBackend.ts) — storage backend, switching between the Tauri filesystem and IndexedDB.
- [src-tauri/](src-tauri/) — Tauri desktop app configuration and Rust shell.
