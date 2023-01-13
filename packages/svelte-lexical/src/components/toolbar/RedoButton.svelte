<script>
  import {
    CAN_REDO_COMMAND,
    REDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
  } from 'lexical';
  import {getContext, onMount} from 'svelte';

  const editor = getContext('editor');

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
  disabled={!canRedo}
  on:click={() => {
    editor.dispatchCommand(REDO_COMMAND);
  }}
  class="toolbar-item spaced"
  aria-label="Redo">
  <i class="format redo" />
</button>
