<script lang="ts">
  import {getActiveEditor} from '../../core/composerContext';
  import {INSERT_IMAGE_COMMAND} from '../../core/plugins/Image/ImagePlugin.svelte';
  import CloseCircleButton from '../generic/button/CloseCircleButton.svelte';
  import ModalDialog from '../generic/dialog/ModalDialog.svelte';

  const activeEditor = getActiveEditor();

  export let showModal = false;
  export function open() {
    showModal = true;
  }

  let src = '';
  let altText = '';
  $: isDisabled = src === '';
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={() => (showModal = false)} />

  <div class="modal">
    <h2 class="Modal__title">Insert Image</h2>
    <div class="Modal__content">
      <div class="Input__wrapper">
        <label class="Input__label" for="lexical-modal-image-url">
          Image URL
        </label>
        <input
          type="text"
          class="Input__input"
          placeholder="i.e. https://source.unsplash.com/random"
          id="lexical-modal-image-url"
          bind:value={src} />
      </div>
      <div class="Input__wrapper">
        <label class="Input__label" for="lexical-modal-image-alttext">
          Alt Text
        </label>
        <input
          type="text"
          class="Input__input"
          placeholder="Random unsplash image"
          id="lexical-modal-image-alttext"
          bind:value={altText} />
      </div>
      <div class="ToolbarPlugin__dialogActions">
        <button
          disabled={isDisabled}
          class="Button__root"
          on:click={() => {
            showModal = false;
            $activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {altText, src});
          }}>
          Confirm
        </button>
      </div>
    </div>
  </div>
</ModalDialog>

<style>
  .modal {
    width: 30em;
  }
</style>
