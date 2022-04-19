<script>
  import { CAN_UNDO_COMMAND, UNDO_COMMAND } from "lexical";
  import { getContext } from "svelte";
  import { COMMAND_PRIORITY_CRITICAL } from "../utils/commandPriority";

  const editor = getContext("editor");

  let canUndo = false;
  editor.registerCommand(
    CAN_UNDO_COMMAND,
    (payload) => {
      canUndo = payload;
      return false;
    },
    COMMAND_PRIORITY_CRITICAL
  );
</script>

<button
  disabled={!canUndo}
  on:click={() => {
    editor.dispatchCommand(UNDO_COMMAND);
  }}
  class="toolbar-item spaced"
  aria-label="Undo"
>
  <i class="format undo" />
</button>
