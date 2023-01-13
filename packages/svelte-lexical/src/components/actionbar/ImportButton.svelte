<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {getContext} from 'svelte';
  import {importFile} from '@lexical/file';

  const editor: LexicalEditor = getContext('editor');
</script>

<button
  class="action-button import"
  on:click={() => importFile(editor)}
  title="Import"
  aria-label="Import editor state from JSON">
  <i class="import" />
</button>
