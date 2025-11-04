# Persistent Editor Demo

This demo showcases how to persist editor content using IndexedDB in a Svelte Lexical application.

## Features

- **Auto-save**: Content is automatically saved to IndexedDB as you type (with 1-second debouncing)
- **Persistent Storage**: Content survives page refreshes and browser restarts
- **Visual Feedback**: Shows save status and last saved time
- **Clear Content**: Button to reset and clear all saved content

## How It Works

The demo uses IndexedDB to store the editor state as JSON:

1. **On Load**: The app checks IndexedDB for previously saved content and initializes the editor with it
2. **On Change**: Every time the editor content changes, it schedules a save operation (debounced by 1 second)
3. **On Save**: The editor state is serialized to JSON and stored in IndexedDB
4. **Clear**: The "Clear All Content" button removes the saved state and reloads the page

## Running the Demo

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Implementation Details

### IndexedDB Utilities (`src/db.js`)

The demo includes a clean utility module for IndexedDB operations:

- `saveEditorState(editorState)` - Saves editor state to IndexedDB
- `loadEditorState()` - Loads editor state from IndexedDB
- `clearEditorState()` - Clears saved editor state

### Editor Integration (`src/App.svelte`)

The main component:

1. Loads initial state from IndexedDB on mount
2. Passes the initial state to the Composer component
3. Registers an update listener to auto-save changes
4. Provides UI for save status and clearing content

## Browser Compatibility

IndexedDB is supported in all modern browsers:
- Chrome/Edge 24+
- Firefox 16+
- Safari 10+
- Opera 15+

## Use Cases

This pattern is useful for:
- Draft saving in content management systems
- Note-taking applications
- Form autosave functionality
- Offline-first applications
- Local-first collaborative tools
