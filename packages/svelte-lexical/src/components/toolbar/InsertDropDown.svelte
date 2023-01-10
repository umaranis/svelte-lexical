<script>
  import {getContext} from 'svelte';
  import DropDown from './controls/DropDown.svelte';
  import {INSERT_HORIZONTAL_RULE_COMMAND} from '../../core/plugins/HorizontalRuleNode.ts';
  import {INSERT_IMAGE_COMMAND} from '../../core/plugins/ImagePlugin.svelte';
  import InsertImageDialog, {open, close} from './InsertImageDialog.svelte';

  const editor = getContext('editor');
</script>

<DropDown
  buttonLabel="Insert"
  buttonIconClassName="icon plus"
  buttonClassName="toolbar-item spaced">
  <button
    on:click={() => {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND);
    }}
    class="item">
    <i class="icon horizontal-rule" />
    <span class="text">Horizontal Rule</span>
  </button>
  <button
    on:click={() => {
      open();
    }}
    class="item">
    <i class="icon image" />
    <span class="text">Image</span>
  </button>
</DropDown>

<InsertImageDialog
  on:confirm={(payload) => {
    close();
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload.detail);
  }} />
