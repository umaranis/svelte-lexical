<script>
  import { getContext } from 'svelte';
  import { FORMAT_ELEMENT_COMMAND } from 'lexical';

  const editor = getContext('editor');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
  }}
  class="toolbar-item spaced" 
  aria-label="Center Align"
>
  <i class="format center-align" />
</button>
