<script lang="ts">
  import pkgUtil from '@lexical/utils';
  const {mergeRegister} = pkgUtil;
  import {type Binding} from '@lexical/yjs';
  import pkgYjs from '@lexical/yjs';
  const {createUndoManager} = pkgYjs;
  import {type LexicalEditor} from 'lexical';
  import pkgLx from 'lexical';
  const {COMMAND_PRIORITY_EDITOR, REDO_COMMAND, UNDO_COMMAND} = pkgLx;
  import {onMount} from 'svelte';

  export let editor: LexicalEditor;
  export let binding: Binding;

  const undoManager = createUndoManager(binding, binding.root.getSharedType());

  onMount(() => {
    const undo = () => {
      undoManager.undo();
    };

    const redo = () => {
      undoManager.redo();
    };

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
    );
  });

  export function clearHistory() {
    undoManager.clear();
  }
</script>
