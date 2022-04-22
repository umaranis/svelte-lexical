<script>
  import { getContext } from "svelte";
  import { FORMAT_ELEMENT_COMMAND } from "lexical";

  const editor = getContext("editor");
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
  }}
  class="toolbar-item spaced" 
  aria-label="Justify Align"
>
  <i class="format justify-align" />
</button>
