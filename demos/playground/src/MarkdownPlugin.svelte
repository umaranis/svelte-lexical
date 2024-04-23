<script lang="ts">
  import {onMount} from 'svelte';
  import {getEditor} from 'svelte-lexical';
  import {
    registerMarkdownShortcuts,
    BOLD_STAR,
    HEADING,
    ORDERED_LIST,
    UNORDERED_LIST,
  } from '@lexical/markdown';

  const editor = getEditor();

  onMount(() =>
    registerMarkdownShortcuts(editor, [
      BOLD_STAR,
      HEADING,
      ORDERED_LIST,
      UNORDERED_LIST,
    ]),
  );
</script>
