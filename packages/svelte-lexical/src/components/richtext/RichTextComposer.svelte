<script lang="ts">
  import {ListItemNode, ListNode} from '@lexical/list';
  import {HeadingNode, QuoteNode} from '@lexical/rich-text';
  import type {EditorThemeClasses} from 'lexical';

  import Composer from '../../core/Composer.svelte';
  import ContentEditable from '../../core/ContentEditable.svelte';
  import HistoryPlugin from '../../core/plugins/HistoryPlugin.svelte';
  import {HorizontalRuleNode} from '../../core/plugins/HorizontalRuleNode';
  import {ImageNode} from '../../core/plugins/ImageNode';
  import ImagePlugin from '../../core/plugins/ImagePlugin.svelte';
  import ListPlugin from '../../core/plugins/ListPlugin.svelte';
  import CheckListPlugin from '../../core/plugins/CheckListPlugin.svelte';
  import HorizontalRulePlugin from '../../core/plugins/HorizontalRulePlugin.svelte';
  import RichTextPlugin from '../../core/plugins/RichTextPlugin.svelte';
  import TreeViewPlugin from '../../core/plugins/TreeViewPlugin.svelte';
  import ActionBar from '../actionbar/ActionBar.svelte';
  import ToolbarRichText from './ToolbarRichText.svelte';

  export let theme: EditorThemeClasses;

  const config = {
    theme,
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
        </div>
      </div>
      <RichTextPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <HorizontalRulePlugin />
      <ImagePlugin />

      <ActionBar />
    </div>
    <TreeViewPlugin />
  </div>
</Composer>
