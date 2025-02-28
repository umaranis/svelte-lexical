<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {SHORTCUTS} from './shortcuts.js';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isBold: Writable<boolean> = getContext('isBold');
</script>

<button
  disabled={!$isEditable}
  onclick={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }}
  class={'toolbar-item spaced ' + ($isBold ? 'active' : '')}
  title={`Bold (${SHORTCUTS.BOLD})`}
  type="button"
  aria-label={`Format text as bold. Shortcut: ${SHORTCUTS.BOLD}`}>
  <i class="format bold"></i>
</button>
