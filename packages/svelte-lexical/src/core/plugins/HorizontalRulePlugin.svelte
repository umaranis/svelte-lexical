<script>
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
  } from 'lexical';
  import { onMount, getContext } from 'svelte';
  import {
    $createHorizontalRuleNode as createHorizontalRuleNode,
    INSERT_HORIZONTAL_RULE_COMMAND,
  } from './HorizontalRuleNode.ts';

  const editor = getContext('editor');

  onMount(() => {
    editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      (type) => {
        const selection = getSelection();
        if (!isRangeSelection(selection)) {
          return false;
        }

        const focusNode = selection.focus.getNode();
        if (focusNode !== null) {
          const horizontalRuleNode = createHorizontalRuleNode();
          selection.insertParagraph();
          selection.focus
            .getNode()
            .getTopLevelElementOrThrow()
            .insertBefore(horizontalRuleNode);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  });
</script>
