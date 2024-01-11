<script lang="ts">
  import pkglink from '@lexical/link';
  const {TOGGLE_LINK_COMMAND} = pkglink;
  import {getContext, onMount} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {sanitizeUrl} from '../../core/plugins/link/url';
  import {getEditor, getIsEditable} from '../../core/composerContext';
  import pkgLx from 'lexical';
  const {COMMAND_PRIORITY_NORMAL, KEY_MODIFIER_COMMAND} = pkgLx;
  import {IS_APPLE} from '../../environment/environment';

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
