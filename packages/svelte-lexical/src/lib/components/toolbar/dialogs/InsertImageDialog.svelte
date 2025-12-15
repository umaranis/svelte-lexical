<!--
@component
Modal Dialog for inserting images via URL into the editor.

Call `editor.extensions.openInsertImageDialog()` to open the dialog.

Only one instance of this component should be instantiated per editor.
-->

<script lang="ts">
  import {FocusEditor} from '$lib/core/commands/commands.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import {tick} from 'svelte';
  import CloseCircleButton from '../../generic/button/CloseCircleButton.svelte';
  import ModalDialog from '../../generic/dialog/ModalDialog.svelte';
  import InsertImageUriDialogBody from './InsertImageUriDialogBody.svelte';

  const editor = getEditor();

  let showModal = $state(false);
  export function open() {
    showModal = true;
  }

  async function close() {
    showModal = false;
    await tick();
    FocusEditor(editor);
  }

  editor.extensions.openInsertImageDialog = open;
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={close} />

  <InsertImageUriDialogBody on:confirm={close} />
</ModalDialog>
