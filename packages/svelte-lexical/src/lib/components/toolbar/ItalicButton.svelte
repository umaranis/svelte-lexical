<script lang="ts">
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {SHORTCUTS} from './shortcuts.js';
  import {toggleItalic} from '$lib/core/commands/commands.js';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isItalic: Writable<boolean> = getContext('isItalic');
</script>

<button
  disabled={!$isEditable}
  onclick={() => {
    toggleItalic($activeEditor);
  }}
  class={'toolbar-item spaced ' + ($isItalic ? 'active' : '')}
  title={`Italic (${SHORTCUTS.ITALIC})`}
  type="button"
  aria-label={`Format text as italics. Shortcut: ${SHORTCUTS.ITALIC}`}>
  <i class="format italic"></i>
</button>
