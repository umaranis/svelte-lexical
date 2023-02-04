<script lang="ts">
  import {onMount} from 'svelte';
  import {
    createEmptyHistoryState,
    registerHistory,
    type HistoryState,
  } from '@lexical/history';
  import type {LexicalEditor} from 'lexical';
  import {getEditor} from '../svelteContext';

  const editor: LexicalEditor = getEditor();
  export let externalHistoryState: HistoryState = createEmptyHistoryState();
  export let delay = 1000;

  // returns callback to unregister
  onMount(() => registerHistory(editor, externalHistoryState, delay));
</script>
