<script>
  import { getContext } from 'svelte';
  import { FORMAT_TEXT_COMMAND } from 'lexical';
  import { isStrikethrough } from '../editor-state/StateStoreBasic';

  const editor = getContext('editor');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  }}
  class={'toolbar-item spaced ' + ($isStrikethrough ? 'active' : '')}
  aria-label="Format Strikethrough"
>
  <i class="format strikethrough" />
</button>
