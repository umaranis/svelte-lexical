<script lang="ts">
  import {mergeRegister} from '@lexical/utils';
  import {createUndoManager, type Binding} from '@lexical/yjs';
  import {
    COMMAND_PRIORITY_EDITOR,
    REDO_COMMAND,
    UNDO_COMMAND,
    type LexicalEditor,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {CAN_REDO_COMMAND, CAN_UNDO_COMMAND} from 'lexical';

  interface Props {
    editor: LexicalEditor;
    binding: Binding;
  }

  let {editor, binding}: Props = $props();

  const undoManager = createUndoManager(binding, binding.root.getSharedType());

  onMount(() => {
    const undo = () => {
      undoManager.undo();
    };

    const redo = () => {
      undoManager.redo();
    };

    // Exposing undo and redo states
    const updateUndoRedoStates = () => {
      editor.dispatchCommand(
        CAN_UNDO_COMMAND,
        undoManager.undoStack.length > 0,
      );
      editor.dispatchCommand(
        CAN_REDO_COMMAND,
        undoManager.redoStack.length > 0,
      );
    };
    undoManager.on('stack-item-added', updateUndoRedoStates);
    undoManager.on('stack-item-popped', updateUndoRedoStates);
    undoManager.on('stack-cleared', updateUndoRedoStates);

    return mergeRegister(
      editor.registerCommand(
        UNDO_COMMAND,
        () => {
          undo();
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        REDO_COMMAND,
        () => {
          redo();
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      () => {
        undoManager.off('stack-item-added', updateUndoRedoStates);
        undoManager.off('stack-item-popped', updateUndoRedoStates);
        undoManager.off('stack-cleared', updateUndoRedoStates);
      },
    );
  });

  export function clearHistory() {
    undoManager.clear();
  }
</script>
