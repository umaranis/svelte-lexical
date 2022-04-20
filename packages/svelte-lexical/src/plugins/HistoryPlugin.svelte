<script>
  import { onMount, getContext } from 'svelte';
  import { createEmptyHistoryState, registerHistory } from '@lexical/history';

  const editor = getContext('editor');
  export let externalHistoryState = createEmptyHistoryState();
  export let delay = 1000;

  onMount(() => {
    registerHistory(editor, externalHistoryState, delay);
  });
</script>
