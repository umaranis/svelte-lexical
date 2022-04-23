<script>
  import { getContext } from 'svelte';
  import {
    FORMAT_ELEMENT_COMMAND,
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
  } from 'lexical';
  import DropDown from './controls/DropDown.svelte';
  import Divider from './Divider.svelte';
  import { isRTL } from '../editor-state/StateStoreRichText';

  const editor = getContext('editor');
</script>

<DropDown
  buttonLabel="Align"
  buttonIconClassName="icon left-align"
  buttonClassName="toolbar-item spaced"
>
  <button
    on:click={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
    }}
    class="item"
  >
    <i class="icon left-align" />
    <span class="text">Left Align</span>
  </button>
  <button
    on:click={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
    }}
    class="item"
  >
    <i class="icon center-align" />
    <span class="text">Center Align</span>
  </button>
  <button
    on:click={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
    }}
    class="item"
  >
    <i class="icon right-align" />
    <span class="text">Right Align</span>
  </button>
  <button
    on:click={() => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
    }}
    class="item"
  >
    <i class="icon justify-align" />
    <span class="text">Justify Align</span>
  </button>
  <Divider />
  <button
    on:click={() => {
      editor.dispatchCommand(INDENT_CONTENT_COMMAND);
    }}
    class="item"
  >
    <i class={'icon ' + ($isRTL ? 'outdent' : 'indent')} />
    <span class="text">Indent</span>
  </button>
  <button
    on:click={() => {
      editor.dispatchCommand(OUTDENT_CONTENT_COMMAND);
    }}
    class="item"
  >
    <i class={'icon ' + ($isRTL ? 'indent' : 'outdent')} />
    <span class="text">Outdent</span>
  </button>
</DropDown>
