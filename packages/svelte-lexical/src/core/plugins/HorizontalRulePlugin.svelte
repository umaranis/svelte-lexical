<script lang="ts">
  import pkgLx from 'lexical';
  const {
    $getSelection: getSelection,
    $isRangeSelection: isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
  } = pkgLx;
  import pkgUtils from '@lexical/utils';
  const {$insertNodeToNearestRoot: insertNodeToNearestRoot} = pkgUtils;
  import {onMount} from 'svelte';
  import {
    $createHorizontalRuleNode as createHorizontalRuleNode,
    INSERT_HORIZONTAL_RULE_COMMAND,
  } from './HorizontalRuleNode';
  import {getEditor} from '../composerContext';

  const editor = getEditor();

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
          insertNodeToNearestRoot(horizontalRuleNode);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  });
</script>
