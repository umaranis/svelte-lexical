<script lang="ts">
  import {getCommands} from '$lib/core/commands.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import CloseCircleButton from '../../generic/button/CloseCircleButton.svelte';
  import ModalDialog from '../../generic/dialog/ModalDialog.svelte';
  import InsertImageUriDialogBody from './InsertImageUriDialogBody.svelte';

  const editor = getEditor();

  export let showModal = false;
  export function open() {
    showModal = true;
  }

  function close() {
    showModal = false;
    getCommands().FocusEditor.execute(editor);
  }
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={close} />

  <InsertImageUriDialogBody on:confirm={close} />
</ModalDialog>
