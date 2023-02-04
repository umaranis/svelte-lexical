<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {exportFile} from '@lexical/file';
  import {getEditor} from '../../core/svelteContext';

  const editor: LexicalEditor = getEditor();
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
