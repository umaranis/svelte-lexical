<script lang="ts">
  import {
    Composer,
    ContentEditable,
    ActionBar,
    PlainTextPlugin,
    HistoryPlugin,
  } from '$lib/index.js';
  import editorTheme from '$lib/themes/PlaygroundEditorTheme.js';
  import Composer1Toolbar from './Composer1Toolbar.svelte';

  const initialConfig = {
    theme: editorTheme,
    namespace: 'Playground',
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
  };
</script>

<Composer {initialConfig}>
  <div class="editor-shell">
    <Composer1Toolbar />
    <div class="editor-container">
      <div class="editor-scroller">
        <div class="editor">
          <ContentEditable />
        </div>
      </div>
      <PlainTextPlugin />
      <HistoryPlugin />

      <ActionBar />
    </div>
  </div>
</Composer>
