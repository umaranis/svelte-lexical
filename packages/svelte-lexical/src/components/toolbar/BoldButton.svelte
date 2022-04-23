<script>
  import { getContext } from 'svelte';
  import { FORMAT_TEXT_COMMAND } from 'lexical';
  import { isBold } from '../editor-state/StateStoreBasic';

  const editor = getContext('editor');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }}
  class={'toolbar-item spaced ' + ($isBold ? 'active' : '')}
  aria-label="Format Bold"
>
  <i class="format bold" />
</button>
