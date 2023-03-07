<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getActiveEditor, getIsEditable} from '../../core/svelteContext';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {IS_APPLE} from '../../environment/environment';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isItalic: Writable<boolean> = getContext('isItalic');
</script>

<button
  disabled={!isEditable}
  on:click={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }}
  class={'toolbar-item spaced ' + ($isItalic ? 'active' : '')}
  title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
  type="button"
  aria-label={`Format text as italics. Shortcut: ${
    IS_APPLE ? '⌘I' : 'Ctrl+I'
  }`}>
  <i class="format italic" />
</button>
