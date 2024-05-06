<script lang="ts">
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
  } from 'lexical';
  import {$insertNodeToNearestRoot as insertNodeToNearestRoot} from '@lexical/utils';
  import {onMount} from 'svelte';
  import {
    $createHorizontalRuleNode as createHorizontalRuleNode,
    INSERT_HORIZONTAL_RULE_COMMAND,
  } from './HorizontalRuleNode.js';
  import {getEditor} from '../composerContext.js';

  const editor = getEditor();

  onMount(() => {
    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      (type) => {
        const selection = getSelection();
        if (!isRangeSelection(selection)) {
          return false;
        }

        const focusNode = selection.focus.getNode();
        if (focusNode !== null) {
          const horizontalRuleNode = createHorizontalRuleNode();
          insertNodeToNearestRoot(horizontalRuleNode);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  });
</script>
