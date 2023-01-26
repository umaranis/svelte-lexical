<script lang="ts">
  import {ListItemNode, ListNode} from '@lexical/list';
  import {HeadingNode, QuoteNode} from '@lexical/rich-text';
  import type {EditorThemeClasses, LexicalEditor} from 'lexical';

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
  import ActionBar from '../actionbar/ActionBar.svelte';
  import ToolbarRichText from './ToolbarRichText.svelte';
  import type {SvelteComponent} from 'svelte';

  export let theme: EditorThemeClasses;

  let composer: SvelteComponent;

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

  export function getEditor(): LexicalEditor {
    return composer.$$.context.get('editor');
  }
</script>

<Composer {config} bind:this={composer}>
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
      <CheckListPlugin />
      <HorizontalRulePlugin />
      <ImagePlugin />

      <ActionBar />
    </div>
  </div>
</Composer>
