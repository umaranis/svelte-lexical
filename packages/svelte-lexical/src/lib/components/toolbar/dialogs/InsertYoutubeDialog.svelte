<script lang="ts">
  import CloseCircleButton from '$lib/components/generic/button/CloseCircleButton.svelte';
  import ModalDialog from '$lib/components/generic/dialog/ModalDialog.svelte';
  import TextInput from '$lib/components/generic/input/TextInput.svelte';
  import {FocusEditor} from '$lib/core/commands.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import {INSERT_YOUTUBE_COMMAND} from '$lib/core/plugins/youtube/YoutubePlugin.svelte';
  import {tick} from 'svelte';

  let url = $state('');
  let id = $derived.by(() => parseUrl(url));
  let isDisabled = $derived.by(() => !id);

  let editor = getEditor();

  interface Props {
    showModal?: boolean;
  }

  let {showModal = $bindable(false)}: Props = $props();
  export function open() {
    showModal = true;
  }
  async function close() {
    showModal = false;
    await tick();
    FocusEditor(editor);
  }

  async function insertVideo() {
    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, id!);
    close();
  }

  // determine if a given URL is a match and return video id.
  function parseUrl(url: string) {
    const match =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/.exec(url);

    return match ? (match?.[2].length === 11 ? match[2] : null) : null;
  }
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={close} />
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
