<script lang="ts">
  import CloseCircleButton from '$lib/components/generic/button/CloseCircleButton.svelte';
  import ModalDialog from '$lib/components/generic/dialog/ModalDialog.svelte';
  import TextInput from '$lib/components/generic/input/TextInput.svelte';
  import {FocusEditor} from '$lib/core/commands.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import {INSERT_BLUESKY_COMMAND} from '$lib/core/plugins/bluesky/BlueskyPlugin.svelte';
  import {tick} from 'svelte';

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

  async function insertBluesky() {
    editor.dispatchCommand(INSERT_BLUESKY_COMMAND, post!);
    close();
  }

  // determine if a given URL is a match and return bluesky profile and post key.
  export const parseUrl = (str: string) => {
    const url = safe_parse_url(str);
    if (!url) {
      return null;
    }

    let match: RegExpExecArray | null | undefined;
    if (
      url.host === 'bsky.app' ||
      url.host === 'staging.bsky.app' ||
      url.host === 'main.bsky.dev'
    ) {
      if (
        (match = /^\/profile\/([^/]+)\/post\/([^/]+)\/?$/.exec(url.pathname))
      ) {
        if (!is_at_identifier(match[1]) || !is_tid(match[2])) {
          return null;
        }

        return {profile: match[1], postKey: match[2]};
      }
    }

    return null;
  };

  const safe_parse_url = (str: string): URL | null => {
    let url: URL | null | undefined;
    if ('parse' in URL) {
      url = URL.parse(str);
    } else {
      try {
        // @ts-expect-error: `'parse' in URL` is giving truthy
        url = new URL(str);
      } catch {
        url = null;
      }
    }

    if (url && (url.protocol === 'https:' || url.protocol === 'http:')) {
      return url;
    }

    return null;
  };

  export const TID_RE =
    /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/;

  export const is_tid = (str: string): boolean => {
    return str.length === 13 && TID_RE.test(str);
  };

  export const DID_RE = /^did:([a-z]+):([a-zA-Z0-9._:%-]*[a-zA-Z0-9._-])$/;

  export const is_did = (str: string): boolean => {
    return str.length >= 7 && str.length <= 2048 && DID_RE.test(str);
  };

  export const HANDLE_RE =
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

  export const is_handle = (str: string): boolean => {
    return str.length >= 3 && str.length <= 253 && HANDLE_RE.test(str);
  };

  const is_at_identifier = (str: string): boolean => {
    return is_did(str) || is_handle(str);
  };

  let url = $state('');
  let post = $derived.by(() => parseUrl(url));
  let isDisabled = $derived.by(() => !post);
</script>

<ModalDialog bind:showModal>
  <CloseCircleButton on:click={close} />
  <div class="modal">
    <h2 class="Modal__title">Embed Bluesky Post</h2>
    <div class="Modal__content">
      <TextInput
        label="Bluesky URL"
        placeholder="i.e. https://bsky.app/profile/syedumar.bsky.social/post/3lktvwrbcic25"
        bind:value={url}
        dataTestId="bluesky-embed-modal-url" />
      <div class="DialogActions">
        <button
          data-test-id="bluesky-embed-modal-submit-btn"
          disabled={isDisabled}
          class="Button__root"
          class:Button__disabled={isDisabled}
          onclick={insertBluesky}>
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
