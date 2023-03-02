<script lang="ts">
  import {FORMAT_ELEMENT_COMMAND} from 'lexical';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
</script>

<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
  }}
  class="toolbar-item spaced"
  aria-label="Left Align">
  <i class="format left-align" />
</button>
