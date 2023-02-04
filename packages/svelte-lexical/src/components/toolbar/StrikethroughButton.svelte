<script>
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {isStrikethrough} from '../editor-state/StateStoreBasic';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  }}
  class={'toolbar-item spaced ' + ($isStrikethrough ? 'active' : '')}
  aria-label="Format Strikethrough">
  <i class="format strikethrough" />
</button>
