<script>
  import {Composer, ContentEditable, RichTextPlugin} from 'svelte-lexical';
  import {HistoryPlugin} from 'svelte-lexical/plugins/history';
  import {ToolbarBasic} from 'svelte-lexical';
  import {theme as editorTheme} from 'svelte-lexical/dist/themes/default';
  import {onMount} from 'svelte';
  import {saveEditorState, loadEditorState, clearEditorState} from './db.js';

  let composer;
  let initialEditorState = null;
  let isLoading = true;
  let lastSaved = null;
  let saveStatus = '';

  // Load initial state from IndexedDB
  onMount(async () => {
    try {
      const savedState = await loadEditorState();
      if (savedState) {
        initialEditorState = savedState;
      }
    } catch (error) {
      console.error('Failed to load editor state:', error);
    } finally {
      isLoading = false;
    }

    // Set up auto-save after editor is initialized
    if (composer) {
      setupAutoSave();
    }
  });

  // Set up auto-save when composer is bound
  $: if (composer && !isLoading) {
    setupAutoSave();
  }

  let saveTimeout;
  function setupAutoSave() {
    const editor = composer.getEditor();

    // Register update listener to auto-save
    editor.registerUpdateListener(({editorState}) => {
      // Clear previous timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Debounce save by 1 second
      saveTimeout = setTimeout(async () => {
        try {
          const stateJSON = JSON.stringify(editorState.toJSON());
          await saveEditorState(stateJSON);
          lastSaved = new Date();
          saveStatus = 'Saved';

          // Clear status after 2 seconds
          setTimeout(() => {
            saveStatus = '';
          }, 2000);
        } catch (error) {
          console.error('Failed to save editor state:', error);
          saveStatus = 'Save failed';
        }
      }, 1000);
    });
  }

  async function handleClear() {
    if (confirm('Are you sure you want to clear all content? This cannot be undone.')) {
      try {
        await clearEditorState();
        window.location.reload();
      } catch (error) {
        console.error('Failed to clear editor state:', error);
        alert('Failed to clear content. Please try again.');
      }
    }
  }

  function onError(error) {
    console.error('Editor error:', error);
  }
</script>

<main>
  <div class="header">
    <img src="/images/logo.svg" alt="Svelte Lexical!" />
    <h1>Persistent Editor Demo</h1>
    <p>
      This editor automatically saves your content to IndexedDB. Your changes are
      preserved even after closing the browser!
    </p>
  </div>

  {#if isLoading}
    <div class="loading">Loading editor...</div>
  {:else}
    <div class="editor-container">
      <div class="toolbar-container">
        <div class="save-status">
          {#if saveStatus}
            <span class="status-badge">{saveStatus}</span>
          {/if}
          {#if lastSaved}
            <span class="last-saved">Last saved: {lastSaved.toLocaleTimeString()}</span>
          {/if}
        </div>
        <button class="clear-button" onclick={handleClear}>
          Clear All Content
        </button>
      </div>

      <Composer
        bind:this={composer}
        initialConfig={{
          namespace: 'PersistentEditor',
          theme: editorTheme,
          onError,
          editorState: initialEditorState,
        }}>
        <ToolbarBasic />
        <RichTextPlugin>
          <ContentEditable placeholder="Start typing..." />
        </RichTextPlugin>
        <HistoryPlugin />
      </Composer>
    </div>
  {/if}
</main>

<style>
  .header {
    text-align: center;
    padding: 1em;
    max-width: none;
    margin: 0 auto;
  }

  h1 {
    margin: 0.5em 0;
    color: #333;
  }

  img {
    margin: 2em auto 1em;
    max-width: 600px;
    display: block;
  }

  .loading {
    text-align: center;
    padding: 2em;
    font-size: 1.2em;
    color: #666;
  }

  .editor-container {
    max-width: 900px;
    margin: 2em auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .toolbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75em 1em;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
    border-radius: 8px 8px 0 0;
  }

  .save-status {
    display: flex;
    align-items: center;
    gap: 1em;
    font-size: 0.9em;
  }

  .status-badge {
    padding: 0.25em 0.75em;
    background: #4caf50;
    color: white;
    border-radius: 12px;
    font-size: 0.85em;
    font-weight: 500;
  }

  .last-saved {
    color: #666;
  }

  .clear-button {
    padding: 0.5em 1em;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 500;
    transition: background 0.2s;
  }

  .clear-button:hover {
    background: #d32f2f;
  }
</style>
