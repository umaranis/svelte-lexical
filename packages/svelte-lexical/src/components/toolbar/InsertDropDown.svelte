<script lang="ts">
  import {INSERT_IMAGE_COMMAND} from '../../core/plugins/ImagePlugin.svelte';
  import InsertImageDialog, {open, close} from './InsertImageDialog.svelte';
  import {getActiveEditor} from '../../core/svelteContext';
  import DropDown from '../generic/dropdown/DropDown.svelte';
  import DropDownItem from '../generic/dropdown/DropDownItem.svelte';
  import {INSERT_HORIZONTAL_RULE_COMMAND} from '../../core/plugins/HorizontalRuleNode';

  const activeEditor = getActiveEditor();
  export let disabled: boolean;
</script>

<DropDown
  {disabled}
  buttonClassName="toolbar-item spaced"
  buttonLabel="Insert"
  buttonAriaLabel="Insert specialized editor node"
  buttonIconClassName="icon plus">
  <DropDownItem
    on:click={() => {
      $activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    }}
    class="item">
    <i class="icon horizontal-rule" />
    <span class="text">Horizontal Rule</span>
  </DropDownItem>
  <DropDownItem on:click={open} class="item">
    <i class="icon image" />
    <span class="text">Image</span>
  </DropDownItem>
</DropDown>

<InsertImageDialog
  on:confirm={(payload) => {
    close();
    $activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload.detail);
  }} />
