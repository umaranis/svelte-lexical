<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {SHORTCUTS} from './shortcuts.js';
  import {InsertLink} from '$lib/core/commands.js';

  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();
  const isLink: Writable<boolean> = getContext('isLink');
</script>

<button
  disabled={!$isEditable}
  onclick={() => InsertLink($activeEditor, $isLink)}
  class={'toolbar-item spaced ' + ($isLink ? 'active' : '')}
  aria-label="Insert link"
  title={`Insert link (${SHORTCUTS.INSERT_LINK})`}
  type="button">
  <i class="format link"></i>
</button>
