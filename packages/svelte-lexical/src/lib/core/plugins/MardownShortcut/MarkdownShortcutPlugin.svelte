<script lang="ts">
  import {onMount} from 'svelte';
  import {registerMarkdownShortcuts} from '@lexical/markdown';
  import {type Transformer} from '@lexical/markdown';
  import {getEditor} from '$lib/core/composerContext.js';

  interface Props {
    transformers: Array<Transformer>;
  }

  let {transformers}: Props = $props();

  const editor = getEditor();

  onMount(() => {
    return registerMarkdownShortcuts(editor, transformers);
  });
</script>
