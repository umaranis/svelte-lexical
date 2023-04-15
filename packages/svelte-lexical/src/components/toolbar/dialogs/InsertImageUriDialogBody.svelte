<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import {getActiveEditor} from '../../../core/composerContext';
  import {INSERT_IMAGE_COMMAND} from '../../../core/plugins/Image/ImagePlugin.svelte';
  import TextInput from '../../generic/input/TextInput.svelte';

  const activeEditor = getActiveEditor();
  const dispatch = createEventDispatcher();

  let src = '';
  let altText = '';
  $: isDisabled = src === '';
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
    <div class="ToolbarPlugin__dialogActions">
      <button
        data-test-id="image-modal-confirm-btn"
        disabled={isDisabled}
        class="Button__root"
        on:click={() => {
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
