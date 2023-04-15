<script lang="ts">
  import CloseCircleButton from '../../generic/button/CloseCircleButton.svelte';
  import ModalDialog from '../../generic/dialog/ModalDialog.svelte';
  import InsertImageUriDialogBody from './InsertImageUriDialogBody.svelte';

  export let showModal = false;
  export function open() {
    showModal = true;
  }
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={() => (showModal = false)} />

  <InsertImageUriDialogBody on:confirm={() => (showModal = false)} />
</ModalDialog>
