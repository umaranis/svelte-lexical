<script lang="ts">
  import {ListItemNode, ListNode} from '@lexical/list';
  import {HeadingNode, QuoteNode} from '@lexical/rich-text';
  import type {EditorThemeClasses, LexicalEditor} from 'lexical';

  import Composer from '$lib/core/Composer.svelte';
  import ContentEditable from '$lib/core/ContentEditable.svelte';
  import SharedHistoryPlugin from '$lib/core/plugins/SharedHistoryPlugin.svelte';
  import {HorizontalRuleNode} from '$lib/core/plugins/HorizontalRuleNode.js';
  import {ImageNode} from '$lib/core/plugins/Image/ImageNode.js';
  import ImagePlugin from '$lib/core/plugins/Image/ImagePlugin.svelte';
  import ListPlugin from '$lib/core/plugins/ListPlugin.svelte';
  import CheckListPlugin from '$lib/core/plugins/CheckListPlugin.svelte';
  import HorizontalRulePlugin from '$lib/core/plugins/HorizontalRulePlugin.svelte';
  import RichTextPlugin from '$lib/core/plugins/RichTextPlugin.svelte';
  import ActionBar from '../actionbar/ActionBar.svelte';
  import ToolbarRichText from './ToolbarRichText.svelte';
  import PlaceHolder from '$lib/core/plugins/PlaceHolder.svelte';
  import AutoFocusPlugin from '$lib/core/plugins/AutoFocusPlugin.svelte';
  import CaptionEditorHistoryPlugin from '$lib/core/plugins/Image/CaptionEditorHistoryPlugin.svelte';

  interface Props {
    theme: EditorThemeClasses;
  }

  let {theme}: Props = $props();

  let composer: Composer;

  const initialConfig = {
    namespace: 'Playground',
    theme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      HorizontalRuleNode,
      ImageNode,
    ],
    onError: (error: Error) => {
      throw error;
    },
  };

  export function getEditor(): LexicalEditor {
    return composer.getEditor();
  }
</script>

<Composer {initialConfig} bind:this={composer}>
  <div class="editor-shell svelte-lexical">
    <ToolbarRichText />
    <div class="editor-container">
      <div class="editor-scroller">
        <div class="editor">
          <ContentEditable />
          <PlaceHolder>Enter rich text...</PlaceHolder>
        </div>
      </div>
      <AutoFocusPlugin />
      <RichTextPlugin />
      <SharedHistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <HorizontalRulePlugin />
      <ImagePlugin>
        <CaptionEditorHistoryPlugin />
      </ImagePlugin>

      <ActionBar />
    </div>
  </div>
</Composer>
