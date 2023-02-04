<script>
  import {
    CAN_UNDO_COMMAND,
    UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();

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
