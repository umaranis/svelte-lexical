<script lang="ts">
  import {getContext} from 'svelte';
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {SHORTCUTS} from './shortcuts.js';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isUnderline: Writable<boolean> = getContext('isUnderline');
</script>

<button
  disabled={!$isEditable}
  onclick={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  }}
  class={'toolbar-item spaced ' + ($isUnderline ? 'active' : '')}
  title={`Underline (${SHORTCUTS.UNDERLINE})`}
  type="button"
  aria-label={`Format text to underlined. Shortcut: ${SHORTCUTS.UNDERLINE}`}>
  <i class="format underline"></i>
</button>
