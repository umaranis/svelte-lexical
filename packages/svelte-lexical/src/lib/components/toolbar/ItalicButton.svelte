<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {IS_APPLE} from '@lexical/utils';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isItalic: Writable<boolean> = getContext('isItalic');
</script>

<button
  disabled={!$isEditable}
  onclick={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }}
  class={'toolbar-item spaced ' + ($isItalic ? 'active' : '')}
  title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
  type="button"
  aria-label={`Format text as italics. Shortcut: ${
    IS_APPLE ? '⌘I' : 'Ctrl+I'
  }`}>
  <i class="format italic"></i>
</button>
