<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {SHORTCUTS} from './shortcuts.js';
  import {toggleStrikethrough} from '$lib/core/commands/commands.js';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
</script>

<button
  disabled={!$isEditable}
  onclick={() => {
    toggleStrikethrough($activeEditor);
  }}
  class={'toolbar-item spaced ' + ($isStrikethrough ? 'active' : '')}
  title={`Strikethrough (${SHORTCUTS.STRIKETHROUGH})`}
  type="button"
  aria-label="Format text with a strikethrough">
  <i class="format strikethrough"></i>
</button>
