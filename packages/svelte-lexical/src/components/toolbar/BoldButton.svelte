<script>
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {isBold} from '../editor-state/StateStoreBasic';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }}
  class={'toolbar-item spaced ' + ($isBold ? 'active' : '')}
  aria-label="Format Bold">
  <i class="format bold" />
</button>
