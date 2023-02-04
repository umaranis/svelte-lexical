<script>
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {isItalic} from '../editor-state/StateStoreBasic';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }}
  class={'toolbar-item spaced ' + ($isItalic ? 'active' : '')}
  aria-label="Format Italics">
  <i class="format italic" />
</button>
