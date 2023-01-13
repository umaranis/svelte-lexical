<script>
  import {
    CAN_UNDO_COMMAND,
    UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
  } from 'lexical';
  import {getContext, onMount} from 'svelte';

  const editor = getContext('editor');

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
  disabled={!canUndo}
  on:click={() => {
    editor.dispatchCommand(UNDO_COMMAND);
  }}
  class="toolbar-item spaced"
  aria-label="Undo">
  <i class="format undo" />
</button>
