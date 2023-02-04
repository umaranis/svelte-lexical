<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {importFile} from '@lexical/file';
  import {getEditor} from '../../core/svelteContext';

  const editor: LexicalEditor = getEditor();
</script>

<button
  class="action-button import"
  on:click={() => importFile(editor)}
  title="Import"
  aria-label="Import editor state from JSON">
  <i class="import" />
</button>
