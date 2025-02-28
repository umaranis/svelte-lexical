<script lang="ts">
  import {run} from 'svelte/legacy';

  import {onMount, tick} from 'svelte';
  import {
    CloseCircleButton,
    InsertImageUploadedDialogBody,
    ModalDialog,
    type ImagePayload,
    InsertImageUriDialogBody,
    getActiveEditor,
    getEditor,
    InsertImage,
    FocusEditor,
  } from 'svelte-lexical';

  import landscapeImage from './images/landscape.jpg';
  import yellowFlowerImage from './images/yellow-flower.jpg';

  interface Props {
    showModal?: boolean;
  }

  let {showModal = $bindable(false)}: Props = $props();
  export function open() {
    showModal = true;
  }

  let mode: null | 'url' | 'file' = $state(null);
  run(() => {
    if (!showModal) {
      mode = null;
    }
  });

  let hasModifier = $state(false);

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
    InsertImage($activeEditor, payload);
    closeDialog();
  }

  async function closeDialog() {
    showModal = false;
    await tick();
    FocusEditor(editor);
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
            onclick={() =>
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
            onclick={() => (mode = 'url')}>
            URL
          </button>
          <button
            class="Button__root"
            data-test-id="image-modal-option-file"
            onclick={() => (mode = 'file')}>
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
