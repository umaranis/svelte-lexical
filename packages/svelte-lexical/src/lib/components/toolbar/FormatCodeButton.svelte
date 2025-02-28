<script lang="ts">
  import {FORMAT_TEXT_COMMAND} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {SHORTCUTS} from './shortcuts.js';

  const isEditable = getIsEditable();
  const activeEditor = getActiveEditor();
  const isCode: Writable<boolean> = getContext('isCode');
</script>

<button
  disabled={!$isEditable}
  onclick={() => {
    $activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  }}
  class={'toolbar-item spaced ' + ($isCode ? 'active' : '')}
  title={`Insert code block (${SHORTCUTS.CODE_BLOCK})`}
  type="button"
  aria-label="Insert code block">
  <i class="format code"></i>
</button>
