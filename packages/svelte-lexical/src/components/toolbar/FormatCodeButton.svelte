<script>
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  //import { isCode } from '../editor-state/StateStoreBasic.js';

  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();
</script>

<!--
<button
  on:click={() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  }}
  class={'toolbar-item spaced ' + ($isCode ? 'active' : '')}
  aria-label="Format Code"
>
  <i class="format code" />
</button>
-->
