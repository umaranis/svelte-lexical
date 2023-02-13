<script>
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getEditor} from '../../core/svelteContext';
  import {getContext} from 'svelte';

  const editor = getEditor();
  const isBold = getContext('isBold');
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }}
  class={'toolbar-item spaced ' + ($isBold ? 'active' : '')}
  aria-label="Format Bold">
  <i class="format bold" />
</button>
