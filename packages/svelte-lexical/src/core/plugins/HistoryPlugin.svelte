<script>
  import { onMount, getContext } from 'svelte';
  import pkgLH from '@lexical/history';

  const { createEmptyHistoryState, registerHistory } = pkgLH;

  const editor = getContext('editor');
  export let externalHistoryState = createEmptyHistoryState();
  export let delay = 1000;

  // returns callback to unregister
  onMount(() => registerHistory(editor, externalHistoryState, delay));
</script>
