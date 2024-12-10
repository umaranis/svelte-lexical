<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {getEditor, getIsEditable} from '$lib/core/composerContext.js';

  const editor: LexicalEditor = getEditor();
  const isEditable = getIsEditable();
</script>

<button
  class={`action-button ${!$isEditable ? 'unlock' : 'lock'}`}
  onclick={() => {
    editor.setEditable(!editor.isEditable());
  }}
  title="Read-Only Mode"
  aria-label={`${!$isEditable ? 'Unlock' : 'Lock'} read-only mode`}>
  <i class={!$isEditable ? 'unlock' : 'lock'}></i>
</button>
