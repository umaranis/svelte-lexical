import {DecoratorTextExtension} from '@lexical/extension';
import {$insertNodeIntoLeaf, $wrapNodeInElement} from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  defineExtension,
  type LexicalEditor,
} from 'lexical';
import {
  $createDateTimeNode,
  DateTimeNode,
  INSERT_DATETIME_COMMAND,
  type DateTimePayload,
} from './DateTimeNode.js';

/** Handles INSERT_DATETIME_COMMAND by inserting a DateTimeNode at the selection. */
export function registerDateTime(editor: LexicalEditor): () => void {
  return editor.registerCommand<DateTimePayload>(
    INSERT_DATETIME_COMMAND,
    (payload) => {
      const {dateTime} = payload;
      const dateTimeNode = $createDateTimeNode(dateTime);

      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        dateTimeNode.setFormat(selection.format);
      }
      $insertNodeIntoLeaf(dateTimeNode);
      if ($isRootOrShadowRoot(dateTimeNode.getParentOrThrow())) {
        $wrapNodeInElement(dateTimeNode, $createParagraphNode).selectEnd();
      }

      return true;
    },
    COMMAND_PRIORITY_EDITOR,
  );
}

export const DateTimeExtension = /*#__PURE__*/ defineExtension({
  dependencies: [DecoratorTextExtension],
  name: '@svelte-lexical/DateTime',
  nodes: () => [DateTimeNode],
  register: (editor) => registerDateTime(editor),
});
