<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getActiveEditor, getIsEditable} from '../../core/svelteContext';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {IS_APPLE} from '../../environment/environment';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isBold: Writable<boolean> = getContext('isBold');
</script>

<button
  disabled={!isEditable}
  on:click={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }}
  class={'toolbar-item spaced ' + ($isBold ? 'active' : '')}
  title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
  type="button"
  aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}>
  <i class="format bold" />
</button>
