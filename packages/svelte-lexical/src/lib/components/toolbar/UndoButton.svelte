<script lang="ts">
  import {CAN_UNDO_COMMAND, COMMAND_PRIORITY_CRITICAL} from 'lexical';
  import {onMount} from 'svelte';
  import {
    getEditor,
    getIsEditable,
    getActiveEditor,
  } from '$lib/core/composerContext.js';
  import {IS_APPLE} from '@lexical/utils';
  import {undo} from '$lib/core/commands/commands.js';

  const editor = getEditor();
  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  let canUndo = $state(false);

  // unregisters onDestroy through returned callback
  onMount(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        canUndo = payload;
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  });
</script>

<button
  disabled={!canUndo || !$isEditable}
  onclick={() => {
    undo($activeEditor);
  }}
  title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
  type="button"
  class="toolbar-item spaced"
  aria-label="Undo">
  <i class="format undo"></i>
</button>
