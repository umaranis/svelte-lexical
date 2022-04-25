<script context="module">  
  import ModalDialog, { getModal } from './controls/ModalDialog.svelte';  

  export function open() {
    getModal().open();
  }

  export function close() {
    getModal().close();
  }
</script>

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let src = '';
  let altText = '';
  $: isDisabled = src === '';
</script>

<ModalDialog>
  <h2 class="Modal__title">Insert Image</h2>
  <div class="Modal__content">
    <div class="Input__wrapper">
      <label class="Input__label" for="lexical-modal-image-url">Image URL</label>
      <input
        type="text"
        class="Input__input"
        placeholder="i.e. https://source.unsplash.com/random"
        id="lexical-modal-image-url"
        bind:value={src}
      />
    </div>
    <div class="Input__wrapper">
      <label class="Input__label" for="lexical-modal-image-alttext">Alt Text</label>
      <input
        type="text"
        class="Input__input"
        placeholder="Random unsplash image"
        id="lexical-modal-image-alttext"
        bind:value={altText}
      />
    </div>
    <div class="ToolbarPlugin__dialogActions">
      <button disabled={isDisabled} class="Button__root" on:click={() => dispatch('confirm', { altText, src })}>
        Confirm
      </button>
    </div>
  </div>
</ModalDialog>
