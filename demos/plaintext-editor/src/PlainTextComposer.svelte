<script>
  import {
    Composer,
    ContentEditable,
    ActionBar,
    PlainTextPlugin,
    HistoryPlugin,
  } from 'svelte-lexical';
  import {theme as PlaygroundEditorTheme} from 'svelte-lexical/dist/themes/default';

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
  <div class="editor-shell svelte-lexical">
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
