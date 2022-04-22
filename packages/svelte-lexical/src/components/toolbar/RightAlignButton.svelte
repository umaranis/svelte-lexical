<script>
  import { getContext } from "svelte";
  import { FORMAT_ELEMENT_COMMAND } from "lexical";

  const editor = getContext("editor");
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
  }}
  class="toolbar-item spaced" 
  aria-label="Right Align"
>
  <i class="format right-align" />
</button>
