<script lang="ts">
  import {mergeRegister} from '@lexical/utils';
  import {
    $getNodeByKey as getNodeByKey,
    $getSelection as getSelection,
    $isNodeSelection as isNodeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    type LexicalEditor,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {
    clearSelection,
    createNodeSelectionStore,
  } from '../nodeSelectionStore.js';
  import {$isHorizontalRuleNode as isHorizontalRuleNode} from './HorizontalRuleNode.js';

  export let editor: LexicalEditor;
  export let nodeKey: string;
  export let self: HTMLElement;
  let isSelected = createNodeSelectionStore(editor, nodeKey);

  $: {
    self.className = $isSelected ? 'selected' : '';
  }

  function onDelete(event: KeyboardEvent) {
    if ($isSelected && isNodeSelection(getSelection())) {
      event.preventDefault();
      const node = getNodeByKey(nodeKey);
      if (isHorizontalRuleNode(node)) {
        node.remove();
        return true;
      }
    }
    return false;
  }

  onMount(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          if (event.target === self) {
            if (!event.shiftKey) {
              clearSelection(editor);
            }
            $isSelected = !$isSelected;
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );
  });
</script>
