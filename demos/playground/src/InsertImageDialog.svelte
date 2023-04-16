<script lang="ts">
  import {onMount} from 'svelte';
  import {
    CloseCircleButton,
    InsertImageUploadedDialogBody,
    ModalDialog,
    type ImagePayload,
    getCommands,
    InsertImageUriDialogBody,
    getActiveEditor,
    getEditor,
  } from 'svelte-lexical';

  import landscapeImage from './images/landscape.jpg';
  import yellowFlowerImage from './images/yellow-flower.jpg';

  export let showModal = false;
  export function open() {
    showModal = true;
  }

  $: if (!showModal) {
    mode = null;
  }

  let mode: null | 'url' | 'file' = null;
  let hasModifier = false;

  const editor = getEditor();
  const activeEditor = getActiveEditor();

  onMount(() => {
    hasModifier = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  });

  function insertAndClose(payload: ImagePayload) {
    getCommands().InsertImage.execute($activeEditor, payload);
    closeDialog();
  }

  function closeDialog() {
    showModal = false;
    getCommands().FocusEditor.execute(editor);
  }
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={() => (showModal = false)} />

  {#if !mode}
    <div class="modal">
      <h2 class="Modal__title">Insert Image</h2>
      <div class="Modal__content">
        <div class="ToolbarPlugin__dialogButtonsList">
          <button
            class="Button__root"
            data-test-id="image-modal-option-sample"
            on:click={() =>
              insertAndClose(
                hasModifier
                  ? {
                      altText:
                        'Daylight fir trees forest glacier green high ice landscape',
                      src: landscapeImage,
                    }
                  : {
                      altText: 'Yellow flower in tilt shift lens',
                      src: yellowFlowerImage,
                    },
              )}>
            Sample
          </button>
          <button
            class="Button__root"
            data-test-id="image-modal-option-url"
            on:click={() => (mode = 'url')}>
            URL
          </button>
          <button
            class="Button__root"
            data-test-id="image-modal-option-file"
            on:click={() => (mode = 'file')}>
            File
          </button>
        </div>
      </div>
    </div>
  {:else if mode === 'url'}
    <InsertImageUriDialogBody on:confirm={closeDialog} />
  {:else if mode === 'file'}
    <InsertImageUploadedDialogBody on:confirm={closeDialog} />
  {/if}
</ModalDialog>

<style>
  .modal {
    width: 15em;
  }
</style>
