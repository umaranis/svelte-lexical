<script lang="ts">
  import {run} from 'svelte/legacy';

  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {INSERT_TABLE_COMMAND} from '@lexical/table';
  import ModalDialog from '../../generic/dialog/ModalDialog.svelte';
  import {FocusEditor} from '$lib/core/commands.js';
  import NumberInput from '$lib/components/generic/input/NumberInput.svelte';
  import CloseCircleButton from '$lib/components/generic/button/CloseCircleButton.svelte';
  import {tick} from 'svelte';

  let rows = $state('5');
  let columns = $state('5');
  let isDisabled = $state(true);

  run(() => {
    const row = Number(rows);
    const column = Number(columns);
    if (row && row > 0 && row <= 500 && column && column > 0 && column <= 50) {
      isDisabled = false;
    } else {
      isDisabled = true;
    }
  });

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
    FocusEditor($activeEditor);
  }

  const onClick = () => {
    $activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns,
      rows,
    });

    close();
  };
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={close} />
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
