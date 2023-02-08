<script lang="ts">
  import {
    Composer,
    ContentEditable,
    ToolbarRichText,
    ActionBar,
    RichTextPlugin,
    SharedHistoryPlugin,
    ListPlugin,
    CheckListPlugin,
    HorizontalRulePlugin,
    ImagePlugin,
  } from 'svelte-lexical';
  import {
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    HorizontalRuleNode,
    ImageNode,
    TreeViewPlugin,
    PlaceHolder,
  } from 'svelte-lexical';
  import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

  const config = {
    theme: PlaygroundEditorTheme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      HorizontalRuleNode,
      ImageNode,
    ],
    onError: (error) => {
      throw error;
    },
  };
</script>

<Composer {config}>
  <div class="editor-shell">
    <ToolbarRichText />
    <div class="editor-container tree-view">
      <div class="editor-scroller">
        <div class="editor">
          <ContentEditable />
          <PlaceHolder>Enter rich text...</PlaceHolder>
        </div>
      </div>
      <RichTextPlugin />
      <SharedHistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <HorizontalRulePlugin />
      <ImagePlugin />

      <ActionBar />
    </div>
    <TreeViewPlugin />
  </div>
</Composer>
