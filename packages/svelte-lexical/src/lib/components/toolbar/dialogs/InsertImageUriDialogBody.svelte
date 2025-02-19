<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {INSERT_IMAGE_COMMAND} from '$lib/core/plugins/Image/ImagePlugin.svelte';
  import TextInput from '../../generic/input/TextInput.svelte';

  const activeEditor = getActiveEditor();
  const dispatch = createEventDispatcher();

  let src = $state('');
  let altText = $state('');
  let isDisabled = $derived(src === '');
</script>

<div class="modal">
  <h2 class="Modal__title">Insert Image</h2>
  <div class="Modal__content">
    <TextInput
      label="Image URL"
      placeholder="i.e. https://source.unsplash.com/random"
      bind:value={src}
      dataTestId="image-modal-url-input"
      id="lexical-modal-image-url" />
    <TextInput
      label="Alt Text"
      placeholder="Random unsplash image"
      bind:value={altText}
      dataTestId="image-modal-alt-text-input"
      id="lexical-modal-image-alttext" />
    <div class="DialogActions">
      <button
        data-test-id="image-modal-confirm-btn"
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
