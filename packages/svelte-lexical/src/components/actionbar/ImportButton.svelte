<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import pkgfile from '@lexical/file';
  const {importFile} = pkgfile;
  import {getEditor} from '../../core/composerContext';

  const editor: LexicalEditor = getEditor();
</script>

<button
  class="action-button import"
  on:click={() => importFile(editor)}
  title="Import"
  aria-label="Import editor state from JSON">
  <i class="import" />
</button>
