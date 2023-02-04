<script>
  import {FORMAT_ELEMENT_COMMAND} from 'lexical';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
  }}
  class="toolbar-item spaced"
  aria-label="Center Align">
  <i class="format center-align" />
</button>
