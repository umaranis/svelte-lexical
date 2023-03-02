<script lang="ts">
  import {
    CAN_UNDO_COMMAND,
    UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {
    getEditor,
    getIsEditable,
    getActiveEditor,
  } from '../../core/svelteContext';
  import {IS_APPLE} from '../../environment/environment';

  const editor = getEditor();
  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  let canUndo = false;

  // unregisters onDestroy through returned callback
  onMount(() => {
    editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        canUndo = payload;
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  });
</script>

<button
  disabled={!canUndo || !$isEditable}
  on:click={() => {
    $activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
  }}
  title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
  type="button"
  class="toolbar-item spaced"
  aria-label="Undo">
  <i class="format undo" />
</button>
