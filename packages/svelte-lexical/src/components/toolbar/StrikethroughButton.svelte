<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '../../core/svelteContext';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
</script>

<button
  disabled={!isEditable}
  on:click={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  }}
  class={'toolbar-item spaced ' + ($isStrikethrough ? 'active' : '')}
  title="Strikethrough"
  type="button"
  aria-label="Format text with a strikethrough">
  <i class="format strikethrough" />
</button>
