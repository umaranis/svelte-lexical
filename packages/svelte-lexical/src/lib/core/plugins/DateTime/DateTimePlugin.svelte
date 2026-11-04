<script lang="ts">
  import {$isDecoratorTextNode as isDecoratorTextNode} from '@lexical/extension';
  import {mergeRegister} from '@lexical/utils';
  import {
    $getSelection as getSelection,
    $isNodeSelection as isNodeSelection,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND,
  } from 'lexical';
  import {DateTimeNode} from './DateTimeNode.js';
  import {registerDateTime} from './DateTimeExtension.js';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();

  $effect(() => {
    if (!editor.hasNodes([DateTimeNode])) {
      throw new Error('DateTimePlugin: DateTimeNode not registered on editor');
    }

    return mergeRegister(
      registerDateTime(editor),
      // same as DecoratorTextExtension from @lexical/extension
      editor.registerCommand(
        FORMAT_TEXT_COMMAND,
        (formatType) => {
          const selection = getSelection();
          if (isNodeSelection(selection) || isRangeSelection(selection)) {
            for (const node of selection.getNodes()) {
              if (isDecoratorTextNode(node)) {
                node.toggleFormat(formatType);
              }
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  });
</script>
