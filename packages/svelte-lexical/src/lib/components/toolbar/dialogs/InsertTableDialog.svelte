<!--
@component
Modal Dialog for inserting tables into the editor.

Call `editor.extensions.openInsertTableDialog()` to open the dialog.

Only one instance of this component should be instantiated per editor.
-->
<script lang="ts">
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import ModalDialog from '../../generic/dialog/ModalDialog.svelte';
  import {FocusEditor, insertTable} from '$lib/core/commands/commands.js';
  import NumberInput from '$lib/components/generic/input/NumberInput.svelte';
  import CloseCircleButton from '$lib/components/generic/button/CloseCircleButton.svelte';
  import {tick} from 'svelte';

  let rows = $state('5');
  let columns = $state('5');
  let isDisabled = $state(true);

  $effect(() => {
    const row = Number(rows);
    const column = Number(columns);
    if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
      isDisabled = false;
    } else {
      isDisabled = true;
    }
  });

  const activeEditor = getActiveEditor();

  let showModal = $state(false);
  export function open() {
    showModal = true;
  }

  async function close() {
    showModal = false;
    await tick();
    FocusEditor($activeEditor);
  }

  const onClick = () => {
    insertTable($activeEditor, columns, rows);

    close();
  };
  $activeEditor.extensions.openInsertTableDialog = open;
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton onclick={close} />
  <div class="modal">
    <h2 class="Modal__title">Insert Table</h2>
    <div class="Modal__content">
      <NumberInput
        placeholder="# of rows (1-500)"
        label="Rows"
        bind:value={rows}
        dataTestId="table-modal-rows" />
      <NumberInput
        placeholder="# of columns (1-50)"
        label="Columns"
        bind:value={columns}
        dataTestId="table-modal-columns" />
      <div class="DialogActions" data-test-id="table-model-confirm-insert">
        <button
          type="button"
          disabled={isDisabled}
          class="Button__root"
          class:Button__disabled={isDisabled}
          onclick={onClick}>
          Confirm
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
