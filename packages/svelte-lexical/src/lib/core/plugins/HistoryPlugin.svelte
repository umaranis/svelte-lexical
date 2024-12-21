<script lang="ts">
  import {onMount} from 'svelte';
  import {
    createEmptyHistoryState,
    registerHistory,
    type HistoryState,
  } from '@lexical/history';
  import type {LexicalEditor} from 'lexical';
  import {getEditor} from '../composerContext.js';

  const editor: LexicalEditor = getEditor();
  interface Props {
    externalHistoryState?: HistoryState;
    delay?: number;
  }

  let {externalHistoryState = createEmptyHistoryState(), delay = 1000}: Props =
    $props();

  // returns callback to unregister
  onMount(() => registerHistory(editor, externalHistoryState, delay));
</script>
