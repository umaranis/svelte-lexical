<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {SHORTCUTS} from './shortcuts.js';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
</script>

<button
  disabled={!$isEditable}
  onclick={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  }}
  class={'toolbar-item spaced ' + ($isStrikethrough ? 'active' : '')}
  title={`Strikethrough (${SHORTCUTS.STRIKETHROUGH})`}
  type="button"
  aria-label="Format text with a strikethrough">
  <i class="format strikethrough"></i>
</button>
