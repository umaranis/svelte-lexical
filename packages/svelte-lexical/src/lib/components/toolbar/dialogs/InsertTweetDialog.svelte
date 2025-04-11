<script lang="ts">
  import CloseCircleButton from '$lib/components/generic/button/CloseCircleButton.svelte';
  import ModalDialog from '$lib/components/generic/dialog/ModalDialog.svelte';
  import TextInput from '$lib/components/generic/input/TextInput.svelte';
  import {FocusEditor} from '$lib/core/commands.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import {INSERT_TWEET_COMMAND} from '$lib/core/plugins/twitter/TwitterPlugin.svelte';
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

  async function insertTweet() {
    editor.dispatchCommand(INSERT_TWEET_COMMAND, id!);
    close();
  }

  // determine if a given URL is a match and return tweet id.
  function parseUrl(url: string) {
    const match =
      /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(url);

    if (match != null) {
      return match[5];
    }
    return null;
  }
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={close} />
  <div class="modal">
    <h2 class="Modal__title">Embed Tweet</h2>
    <div class="Modal__content">
      <TextInput
        label="Tweet URL"
        placeholder="i.e. https://x.com/umaranis/status/1904831197710000491"
        bind:value={url}
        dataTestId="tweet-embed-modal-url" />
      <div class="DialogActions">
        <button
          data-test-id="tweet-embed-modal-submit-btn"
          disabled={isDisabled}
          class="Button__root"
          class:Button__disabled={isDisabled}
          onclick={insertTweet}>
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
