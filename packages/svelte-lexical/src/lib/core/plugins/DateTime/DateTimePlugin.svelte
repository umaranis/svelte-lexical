<script lang="ts">
  import {$isDecoratorTextNode as isDecoratorTextNode} from '@lexical/extension';
  import {
    $wrapNodeInElement as wrapNodeInElement,
    mergeRegister,
  } from '@lexical/utils';
  import {
    $createParagraphNode as createParagraphNode,
    $getSelection as getSelection,
    $insertNodes as insertNodes,
    $isNodeSelection as isNodeSelection,
    $isRangeSelection as isRangeSelection,
    $isRootOrShadowRoot as isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_LOW,
    FORMAT_TEXT_COMMAND,
  } from 'lexical';
  import {
    $createDateTimeNode as createDateTimeNode,
    DateTimeNode,
    INSERT_DATETIME_COMMAND,
    type DateTimePayload,
  } from './DateTimeNode.js';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();

  $effect(() => {
    if (!editor.hasNodes([DateTimeNode])) {
      throw new Error('DateTimePlugin: DateTimeNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<DateTimePayload>(
        INSERT_DATETIME_COMMAND,
        (payload) => {
          const {dateTime} = payload;
          const dateTimeNode = createDateTimeNode(dateTime);

          insertNodes([dateTimeNode]);
          if (isRootOrShadowRoot(dateTimeNode.getParentOrThrow())) {
            wrapNodeInElement(dateTimeNode, createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
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
