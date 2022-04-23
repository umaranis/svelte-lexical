<script>
  import { getContext } from 'svelte';
  import { FORMAT_TEXT_COMMAND } from 'lexical';
  import { isItalic } from '../editor-state/StateStoreBasic';

  const editor = getContext('editor');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }}
  class={'toolbar-item spaced ' + ($isItalic ? 'active' : '')}
  aria-label="Format Italics"
>
  <i class="format italic" />
</button>
