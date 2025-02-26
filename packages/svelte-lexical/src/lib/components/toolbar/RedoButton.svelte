<script lang="ts">
  import {
    CAN_REDO_COMMAND,
    REDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {
    getEditor,
    getIsEditable,
    getActiveEditor,
  } from '$lib/core/composerContext.js';
  import {IS_APPLE} from '@lexical/utils';

  const editor = getEditor();
  const activeEditor = getActiveEditor();
  const isEditable = getIsEditable();

  let canRedo = $state(false);

  // unregisters onDestroy through returned callback
  onMount(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        canRedo = payload;
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  });
</script>

<button
  disabled={!canRedo || !$isEditable}
  onclick={() => {
    $activeEditor.dispatchCommand(REDO_COMMAND, undefined);
  }}
  title={IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)'}
  type="button"
  class="toolbar-item"
  aria-label="Redo">
  <i class="format redo"></i>
</button>
