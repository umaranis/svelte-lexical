<!--
@component
Modal Dialog for inserting Youtube videos into the editor.

Call `editor.extensions.openInsertYoutubeDialog()` to open the dialog.

Only one instance of this component should be instantiated per editor.
-->
<script lang="ts">
  import CloseCircleButton from '$lib/components/generic/button/CloseCircleButton.svelte';
  import ModalDialog from '$lib/components/generic/dialog/ModalDialog.svelte';
  import TextInput from '$lib/components/generic/input/TextInput.svelte';
  import {FocusEditor, insertYoutube} from '$lib/core/commands/commands.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import {tick} from 'svelte';

  let url = $state('');
  let id = $derived.by(() => parseUrl(url));
  let isDisabled = $derived.by(() => !id);

  let editor = getEditor();

  let showModal = $state(false);

  export function open() {
    showModal = true;
  }
  async function close() {
    showModal = false;
    await tick();
    FocusEditor(editor);
  }

  async function insertVideo() {
    insertYoutube(editor, id!);
    close();
  }

  // determine if a given URL is a match and return video id.
  function parseUrl(url: string) {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    return match ? (match?.[2].length === 11 ? match[2] : null) : null;
  }

  editor.extensions.openInsertYoutubeDialog = open;
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton onclick={close} />
  <div class="modal">
    <h2 class="Modal__title">Embed Youtube Video</h2>
    <div class="Modal__content">
      <TextInput
        label="YouTube URL"
        placeholder="i.e. https://www.youtube.com/watch?v=VIDEO_ID"
        bind:value={url}
        dataTestId="youtube-video-embed-modal-url" />
      <div class="DialogActions">
        <button
          type="button"
          data-test-id="youtube-video-embed-modal-submit-btn"
          disabled={isDisabled}
          class="Button__root"
          class:Button__disabled={isDisabled}
          onclick={insertVideo}>
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
