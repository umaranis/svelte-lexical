<script lang="ts">
  import {getContext} from 'svelte';
  import type {LexicalEditor} from 'lexical';
  import {exportFile} from '@lexical/file';

  const editor: LexicalEditor = getContext('editor');
</script>

<button
  class="action-button export"
  on:click={() =>
    exportFile(editor, {
      fileName: `Playground ${new Date().toISOString()}`,
      source: 'Playground',
    })}
  title="Export"
  aria-label="Export editor state to JSON">
  <i class="export" />
</button>
