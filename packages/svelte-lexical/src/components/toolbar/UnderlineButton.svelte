<script>
  import { isUnderline } from "../editor-state/StateStoreBasic.js";
  import { getContext } from "svelte";
  import { FORMAT_TEXT_COMMAND } from "lexical";

  const editor = getContext("editor");
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }}
  class={"toolbar-item spaced " + ($isUnderline ? "active" : "")}
  aria-label="Format Underline"
>
  <i class="format underline" />
</button>
