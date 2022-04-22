<script>
  import { getContext } from "svelte";
  import { FORMAT_ELEMENT_COMMAND } from "lexical";

  const editor = getContext("editor");
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
  }}
  class="toolbar-item spaced" 
  aria-label="Left Align"
>
  <i class="format left-align" />
</button>
