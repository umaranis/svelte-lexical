import {
  $createTableNodeWithDimensions,
  applyTableHandlers,
  INSERT_TABLE_COMMAND,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isRootNode,
} from 'lexical';

export function registerTableCommands(editor) {
    const COMMAND_PRIORITY_EDITOR = 0;
    editor.registerCommand(
        INSERT_TABLE_COMMAND,
        (payload) => {
            const { columns, rows } = payload;
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) {
                return true;
            }
            const focus = selection.focus;
            const focusNode = focus.getNode();

            if (focusNode !== null) {
                const tableNode = $createTableNodeWithDimensions(
                    Number(rows),
                    Number(columns),
                );
                if ($isRootNode(focusNode)) {
                    const target = focusNode.getChildAtIndex(focus.offset);
                    if (target !== null) {
                        target.insertBefore(tableNode);
                    } else {
                        focusNode.append(tableNode);
                    }
                    tableNode.insertBefore($createParagraphNode());
                } else {
                    const topLevelNode = focusNode.getTopLevelElementOrThrow();
                    topLevelNode.insertAfter(tableNode);
                }
                tableNode.insertAfter($createParagraphNode());
                const firstCell = tableNode
                    .getFirstChildOrThrow()
                        .getFirstChildOrThrow();
                firstCell.select();
            }
            return true;
        },
        COMMAND_PRIORITY_EDITOR,
    );
}