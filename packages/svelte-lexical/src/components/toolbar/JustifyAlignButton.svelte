<script lang="ts">
  import {FORMAT_ELEMENT_COMMAND} from 'lexical';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
  }}
  class="toolbar-item spaced"
  aria-label="Justify Align">
  <i class="format justify-align" />
</button>
