<script lang="ts">
  import {TOGGLE_LINK_COMMAND} from '@lexical/link';
  import {getContext, onMount} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {sanitizeUrl} from '$lib/core/plugins/link/url.js';
  import {getEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {COMMAND_PRIORITY_NORMAL, KEY_MODIFIER_COMMAND} from 'lexical';
  import {IS_APPLE} from '../../environment/environment.js';

  const editor = getEditor();
  const isEditable = getIsEditable();
  const isLink: Writable<boolean> = getContext('isLink');

  function insertLink() {
    if (!$isLink) {
      return editor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://'),
      );
    } else {
      return editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }

  onMount(() => {
    return editor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const {code, ctrlKey, metaKey} = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          return insertLink();
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  });
</script>

<button
  disabled={!$isEditable}
  on:click={insertLink}
  class={'toolbar-item spaced ' + ($isLink ? 'active' : '')}
  aria-label="Insert link"
  title={IS_APPLE ? 'Insert link (⌘K)' : 'Insert link (Ctrl+K)'}
  type="button">
  <i class="format link" />
</button>
