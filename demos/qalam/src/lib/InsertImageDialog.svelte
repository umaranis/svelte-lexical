<!--
@component
Modal dialog for inserting images, either from a URL or from the local
file system. Replaces the default dialog provided by `svelte-lexical`,
which only supports inserting by URL.

Call `editor.extensions.openInsertImageDialog()` to open the dialog.
-->
<script lang="ts">
  import {tick} from 'svelte';
  import {
    CloseCircleButton,
    InsertImage,
    ModalDialog,
    getActiveEditor,
    getEditor,
    FocusEditor,
  } from 'svelte-lexical';

  const editor = getEditor();
  const activeEditor = getActiveEditor();

  let showModal = $state(false);
  export function open() {
    showModal = true;
  }

  let fileInputEl: HTMLInputElement | undefined = $state();
  let fileSrc = $state('');
  let urlSrc = $state('');
  let altText = $state('');
  // A file and a URL are mutually exclusive: choosing one disables the other
  // until it's cleared, so only one source can ever be submitted.
  let src = $derived(fileSrc || urlSrc);
  let isDisabled = $derived(src === '');
  let isFileChosen = $derived(fileSrc !== '');
  let isUrlEntered = $derived(urlSrc !== '');

  $effect(() => {
    if (!showModal) {
      clearFile();
      urlSrc = '';
      altText = '';
    }
  });

  function loadImage(files: FileList | null) {
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        fileSrc = reader.result;
      }
    };
    reader.readAsDataURL(files[0]);
  }

  function clearFile() {
    fileSrc = '';
    if (fileInputEl) fileInputEl.value = '';
  }

  async function closeDialog() {
    showModal = false;
    await tick();
    FocusEditor(editor);
  }

  function confirm() {
    InsertImage($activeEditor, {altText, src});
    closeDialog();
  }

  editor.extensions.openInsertImageDialog = open;
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton onclick={() => (showModal = false)} />

  <div class="modal">
    <h2 class="Modal__title">Insert Image</h2>
    <div class="Modal__content">
      <div class="Input__wrapper">
        <label class="Input__label" for="qalam-image-file">Image File</label>
        <input
          id="qalam-image-file"
          bind:this={fileInputEl}
          type="file"
          accept="image/*"
          class="Input__input"
          disabled={isUrlEntered}
          data-test-id="image-modal-file-upload"
          onchange={(e) => loadImage((e.target as HTMLInputElement).files)} />
        {#if isFileChosen}
          <button
            type="button"
            class="ClearFieldButton"
            title="Clear file"
            aria-label="Clear file"
            onclick={clearFile}>
            ×
          </button>
        {/if}
      </div>
      <div class="Input__wrapper">
        <label class="Input__label" for="qalam-image-url">Image URL</label>
        <input
          id="qalam-image-url"
          type="text"
          class="Input__input"
          placeholder="https://source.unsplash.com/random"
          bind:value={urlSrc}
          disabled={isFileChosen}
          data-test-id="image-modal-url-input" />
        {#if isUrlEntered}
          <button
            type="button"
            class="ClearFieldButton"
            title="Clear URL"
            aria-label="Clear URL"
            onclick={() => (urlSrc = '')}>
            ×
          </button>
        {/if}
      </div>
      <div class="Input__wrapper">
        <label class="Input__label" for="qalam-image-alt">Alt Text</label>
        <input
          id="qalam-image-alt"
          type="text"
          class="Input__input"
          placeholder="Descriptive alternative text"
          bind:value={altText}
          data-test-id="image-modal-alt-text-input" />
      </div>
      <div class="DialogActions">
        <button
          type="button"
          data-test-id="image-modal-confirm-btn"
          disabled={isDisabled}
          class="Button__root"
          onclick={confirm}>
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

  .Input__input:disabled {
    background-color: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }

  .ClearFieldButton {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    margin-left: 6px;
    border: none;
    border-radius: 50%;
    background: #eee;
    color: #666;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  .ClearFieldButton:hover {
    background: #ddd;
  }
</style>
