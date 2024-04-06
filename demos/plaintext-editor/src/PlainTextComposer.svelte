<script>
  import {
    Composer,
    ContentEditable,
    ActionBar,
    PlainTextPlugin,
    HistoryPlugin,
  } from 'svelte-lexical';
  import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

  const initialConfig = {
    theme: PlaygroundEditorTheme,
    namespace: 'Playground',
    nodes: [],
    onError: (error) => {
      throw error;
    },
  };
</script>

<Composer {initialConfig}>
  <div class="editor-shell">
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
