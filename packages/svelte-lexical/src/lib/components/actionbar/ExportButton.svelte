<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {exportFile} from '@lexical/file';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor: LexicalEditor = getEditor();
</script>

<button
  type="button"
  class="action-button export"
  onclick={() =>
    exportFile(editor, {
      fileName: `Playground ${new Date().toISOString()}`,
      source: 'Playground',
    })}
  title="Export"
  aria-label="Export editor state to JSON">
  <i class="export"></i>
</button>
