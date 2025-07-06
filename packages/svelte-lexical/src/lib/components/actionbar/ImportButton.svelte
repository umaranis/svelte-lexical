<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {importFile} from '@lexical/file';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor: LexicalEditor = getEditor();
</script>

<button
  type="button"
  class="action-button import"
  onclick={() => importFile(editor)}
  title="Import"
  aria-label="Import editor state from JSON">
  <i class="import"></i>
</button>
