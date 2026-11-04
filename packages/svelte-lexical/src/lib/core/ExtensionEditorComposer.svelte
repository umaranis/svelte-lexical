<!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import Decorator from './Decorator.svelte';
  import {setEditor} from './composerContext.js';

  interface Props {
    /**
     * An editor already built with `buildEditorFromExtensions`, typically a nested editor
     * using `NestedEditorExtension`. Its extensions provide nodes, theme, editable state
     * and behaviour (e.g. RichTextExtension), so no RichTextPlugin is needed.
     */
    initialEditor: LexicalEditor;
    children?: import('svelte').Snippet;
  }

  let {initialEditor, children}: Props = $props();

  // The editor is not disposed on unmount: nested editors (e.g. image captions) outlive
  // their component, which is re-created whenever the caption is toggled or the node moves.
  setEditor(initialEditor);
</script>

<Decorator />
{@render children?.()}
