<script lang="ts">
  import pkgLx from 'lexical';
  const {CAN_REDO_COMMAND, REDO_COMMAND, COMMAND_PRIORITY_CRITICAL} = pkgLx;
  import {onMount} from 'svelte';
  import {
    getEditor,
    getIsEditable,
    getActiveEditor,
  } from '../../core/composerContext';
  import {IS_APPLE} from '../../environment/environment';

  const editor = getEditor();
  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  let canRedo = false;

  // unregisters onDestroy through returned callback
  onMount(() => {
    editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        canRedo = payload;
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  });
</script>

<button
  disabled={!canRedo || !$isEditable}
  on:click={() => {
    $activeEditor.dispatchCommand(REDO_COMMAND, undefined);
  }}
  title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
  type="button"
  class="toolbar-item"
  aria-label="Redo">
  <i class="format redo" />
</button>
