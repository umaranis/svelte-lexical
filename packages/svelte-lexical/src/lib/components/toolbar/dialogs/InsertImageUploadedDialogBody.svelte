<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import TextInput from '../../generic/input/TextInput.svelte';
  import {INSERT_IMAGE_COMMAND} from '$lib/core/plugins/Image/ImagePlugin.svelte';
  import FileInput from '../../generic/input/FileInput.svelte';

  const activeEditor = getActiveEditor();
  const dispatch = createEventDispatcher();

  let src = $state('');
  let altText = $state('');
  let isDisabled = $derived(src === '');

  function loadImage(files: FileList | null) {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        src = reader.result;
      }
      return '';
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
    }
  }
</script>

<div class="modal">
  <h2 class="Modal__title">Insert Image</h2>
  <div class="Modal__content">
    <FileInput
      label="Image Upload"
      onChange={loadImage}
      accept="image/*"
      dataTestId="image-modal-file-upload" />
    <TextInput
      label="Alt Text"
      placeholder="Descriptive alternative text"
      bind:value={altText}
      dataTestId="image-modal-alt-text-input" />
    <div class="DialogActions">
      <button
        data-test-id="image-modal-file-upload-btn"
        disabled={isDisabled}
        class="Button__root"
        onclick={() => {
          $activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {altText, src});
          dispatch('confirm');
        }}>
        Confirm
      </button>
    </div>
  </div>
</div>

<style>
  .modal {
    width: 30em;
  }
</style>
