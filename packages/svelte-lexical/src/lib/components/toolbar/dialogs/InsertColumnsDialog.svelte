<script lang="ts">
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {FocusEditor} from '$lib/core/commands.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import CloseCircleButton from '../../generic/button/CloseCircleButton.svelte';
  import ModalDialog from '../../generic/dialog/ModalDialog.svelte';
  import {INSERT_LAYOUT_COMMAND} from '$lib/core/plugins/ColumnsLayout/LayoutItemNode.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import DropDown from '../../generic/dropdown/DropDown.svelte';
  import {tick} from 'svelte';

  const editor = getEditor();
  const activeEditor = getActiveEditor();

  interface Props {
    showModal?: boolean;
  }

  let {showModal = $bindable(false)}: Props = $props();
  export function open() {
    showModal = true;
  }

  async function close() {
    showModal = false;
    await tick();
    FocusEditor(editor);
  }

  const LAYOUTS = [
    {label: '2 columns (equal width)', value: '1fr 1fr'},
    {label: '2 columns (25% - 75%)', value: '1fr 3fr'},
    {label: '3 columns (equal width)', value: '1fr 1fr 1fr'},
    {label: '3 columns (25% - 50% - 25%)', value: '1fr 2fr 1fr'},
    {label: '4 columns (equal width)', value: '1fr 1fr 1fr 1fr'},
  ];

  let currentLabel = $state(LAYOUTS[0].label);
  let currentValue = $state(LAYOUTS[0].value);
  const handleClick = (label: string, value: string) => {
    currentLabel = label;
    currentValue = value;
  };

  let modalDiv = $state<HTMLDivElement | null>(null);
</script>

<ModalDialog bind:showModal stopPropagation={false}>
  <CloseCircleButton on:click={close} />

  <div class="modal" bind:this={modalDiv}>
    <h2 class="Modal__title">Insert Columns Layout</h2>
    <div class="Modal__content">
      <DropDown
        buttonClassName="toolbar-item dialog-dropdown"
        buttonLabel={currentLabel}
        buttonAriaLabel="Insert specialized editor node"
        buttonIconClassName=""
        target={modalDiv}>
        <!-- eslint-disable-next-line svelte/require-each-key -->
        {#each LAYOUTS as layout}
          <DropDownItem
            class={`item ${currentLabel === layout.label ? 'active dropdown-item-active' : ''}`}
            onclick={() => {
              handleClick(layout.label, layout.value);
            }}>
            <span class="text">{layout.label}</span>
          </DropDownItem>
        {/each}
      </DropDown>

      <div class="DialogActions">
        <button
          data-test-id="image-modal-file-upload-btn"
          class="Button__root"
          onclick={() => {
            $activeEditor.dispatchCommand(INSERT_LAYOUT_COMMAND, currentValue);
            close();
          }}>
          Insert
        </button>
      </div>
    </div>
  </div>
</ModalDialog>

<style>
  .modal {
    width: 20em;
  }
</style>
