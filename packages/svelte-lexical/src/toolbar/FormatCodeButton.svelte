<script>
  import { isCode } from "./stores.js";
  import { getContext } from "svelte";
  import { FORMAT_TEXT_COMMAND } from "lexical";

  const editor = getContext("editor");
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  }}
  class={"toolbar-item spaced " + ($isCode ? "active" : "")}
  aria-label="Format Code"
>
  <i class="format code" />
</button>
