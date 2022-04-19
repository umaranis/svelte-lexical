<script>
  import { isStrikethrough } from "./stores.js";
  import { getContext } from "svelte";
  import { FORMAT_TEXT_COMMAND } from "lexical";

  const editor = getContext("editor");
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  }}
  class={"toolbar-item spaced " + ($isStrikethrough ? "active" : "")}
  aria-label="Format Strikethrough"
>
  <i class="format strikethrough" />
</button>
