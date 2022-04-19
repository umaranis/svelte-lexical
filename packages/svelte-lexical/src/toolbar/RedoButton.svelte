<script>
  import { CAN_REDO_COMMAND, REDO_COMMAND } from "lexical";
  import { getContext } from "svelte";
  import { COMMAND_PRIORITY_CRITICAL } from "../utils/commandPriority";

  const editor = getContext("editor");

  let canRedo = false;
  editor.registerCommand(
    CAN_REDO_COMMAND,
    (payload) => {
      canRedo = payload;
      return false;
    },
    COMMAND_PRIORITY_CRITICAL
  );
</script>

<button
  disabled={!canRedo}
  on:click={() => {
    editor.dispatchCommand(REDO_COMMAND);
  }}
  class="toolbar-item spaced"
  aria-label="Redo"
>
  <i class="format redo" />
</button>
