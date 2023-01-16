<script>
  import {
    Composer,
    ContentEditable,
    ToolbarRichText,
    ActionBar,
    RichTextPlugin,
    HistoryPlugin,
    ListPlugin,
  } from 'svelte-lexical';
  import {HeadingNode, QuoteNode, ListNode, ListItemNode} from 'svelte-lexical';
  import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

  const config = {
    theme: PlaygroundEditorTheme,
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
    onError: (error) => {
      throw error;
    },
  };
</script>

<Composer {config}>
  <div class="editor-shell">
    <ToolbarRichText />
    <div class="editor-container">
      <div class="editor-scroller">
        <div class="editor">
          <ContentEditable />
        </div>
      </div>
      <RichTextPlugin />
      <HistoryPlugin />
      <ListPlugin />

      <ActionBar />
    </div>
  </div>
</Composer>
