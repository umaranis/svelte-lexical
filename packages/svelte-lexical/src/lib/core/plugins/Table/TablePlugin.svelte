<script lang="ts">
  import type {
    HTMLTableElementWithWithTableSelectionState,
    InsertTableCommandPayload,
    TableObserver,
  } from '@lexical/table';
  import type {LexicalEditor, NodeKey} from 'lexical';

  import {
    $computeTableMap as computeTableMap,
    $computeTableMapSkipCellCheck as computeTableMapSkipCellCheck,
    $createTableCellNode as createTableCellNode,
    $createTableNodeWithDimensions as createTableNodeWithDimensions,
    $getNodeTriplet as getNodeTriplet,
    $isTableCellNode as isTableCellNode,
    $isTableNode as isTableNode,
    $isTableRowNode as isTableRowNode,
    applyTableHandlers,
    INSERT_TABLE_COMMAND,
    TableCellNode,
    TableNode,
    TableRowNode,
  } from '@lexical/table';
  import {
    $insertFirst as insertFirst,
    $insertNodeToNearestRoot as insertNodeToNearestRoot,
    mergeRegister,
  } from '@lexical/utils';
  import {
    $createParagraphNode as createParagraphNode,
    $getNodeByKey as getNodeByKey,
    $isTextNode as isTextNode,
    COMMAND_PRIORITY_EDITOR,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext.js';

  interface Props {
    hasCellMerge?: boolean;
    hasCellBackgroundColor?: boolean;
    hasTabHandler?: boolean;
  }

  let {
    hasCellMerge = true,
    hasCellBackgroundColor = true,
    hasTabHandler = true,
  }: Props = $props();

  const editor: LexicalEditor = getEditor();

  onMount(() => {
    if (!editor.hasNodes([TableNode, TableCellNode, TableRowNode])) {
      throw new Error(
        'TablePlugin: TableNode, TableCellNode or TableRowNode not registered on editor',
      );
    }
    const unregisterTableInsertCmd =
      editor.registerCommand<InsertTableCommandPayload>(
        INSERT_TABLE_COMMAND,
        ({columns, rows, includeHeaders}) => {
          const tableNode = createTableNodeWithDimensions(
            Number(rows),
            Number(columns),
            includeHeaders,
          );
          insertNodeToNearestRoot(tableNode);

          const firstDescendant = tableNode.getFirstDescendant();
          if (isTextNode(firstDescendant)) {
            firstDescendant.select();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      );
    const unregisterMutationListener = editor.registerNodeTransform(
      TableNode,
      (node) => {
        const [gridMap] = computeTableMapSkipCellCheck(node, null, null);
        const maxRowLength = gridMap.reduce((curLength, row) => {
          return Math.max(curLength, row.length);
        }, 0);
        const rowNodes = node.getChildren();
        for (let i = 0; i < gridMap.length; ++i) {
          const rowNode = rowNodes[i];
          if (!rowNode) {
            continue;
          }
          const rowLength = gridMap[i].reduce(
            (acc, cell) => (cell ? 1 + acc : acc),
            0,
          );
          if (rowLength === maxRowLength) {
            continue;
          }
          for (let j = rowLength; j < maxRowLength; ++j) {
            // TODO: inherit header state from another header or body
            const newCell = createTableCellNode(0);
            newCell.append(createParagraphNode());
            (rowNode as TableRowNode).append(newCell);
          }
        }
      },
    );

    const unregisterUnmergeCellsNodeTransform = unmergeCellsNodeTransform();

    const unregisterRemoveCellColorNodeTransform =
      removeCellColorNodeTransform();

    const unregisterTableSelections = setupTableSelections();
    return mergeRegister(
      unregisterTableInsertCmd,
      unregisterMutationListener,
      unregisterTableSelections,
      unregisterUnmergeCellsNodeTransform,
      unregisterRemoveCellColorNodeTransform,
    );
  });

  function setupTableSelections() {
    const tableSelections = new Map<
      NodeKey,
      [TableObserver, HTMLTableElementWithWithTableSelectionState]
    >();

    const initializeTableNode = (
      tableNode: TableNode,
      nodeKey: NodeKey,
      dom: HTMLElement,
    ) => {
      const tableElement = dom as HTMLTableElementWithWithTableSelectionState;
      const tableSelection = applyTableHandlers(
        tableNode,
        tableElement,
        editor,
        hasTabHandler,
      );
      tableSelections.set(nodeKey, [tableSelection, tableElement]);
    };

    const unregisterMutationListener = editor.registerMutationListener(
      TableNode,
      (nodeMutations) => {
        for (const [nodeKey, mutation] of nodeMutations) {
          if (mutation === 'created' || mutation === 'updated') {
            const tableSelection = tableSelections.get(nodeKey);
            const dom = editor.getElementByKey(nodeKey);
            if (!(tableSelection && dom === tableSelection[1])) {
              // The update created a new DOM node, destroy the existing TableObserver
              if (tableSelection) {
                tableSelection[0].removeListeners();
                tableSelections.delete(nodeKey);
              }
              if (dom !== null) {
                // Create a new TableObserver
                editor.getEditorState().read(() => {
                  const tableNode = getNodeByKey<TableNode>(nodeKey);
                  if (isTableNode(tableNode)) {
                    initializeTableNode(tableNode, nodeKey, dom);
                  }
                });
              }
            }
          } else if (mutation === 'destroyed') {
            const tableSelection = tableSelections.get(nodeKey);
            if (tableSelection !== undefined) {
              tableSelection[0].removeListeners();
              tableSelections.delete(nodeKey);
            }
          }
        }
      },
      {skipInitialization: false},
    );

    return () => {
      unregisterMutationListener();
      // Hook might be called multiple times so cleaning up tables listeners as well,
      // as it'll be reinitialized during recurring call
      for (const [, [tableSelection]] of tableSelections) {
        tableSelection.removeListeners();
      }
    };
  }

  // Unmerge cells when the feature isn't enabled
  function unmergeCellsNodeTransform() {
    if (hasCellMerge) {
      return () => {
        // intentionally empty
      };
    }
    return editor.registerNodeTransform(TableCellNode, (node) => {
      if (node.getColSpan() > 1 || node.getRowSpan() > 1) {
        // When we have rowSpan we have to map the entire Table to understand where the new Cells
        // fit best; let's analyze all Cells at once to save us from further transform iterations
        const [, , gridNode] = getNodeTriplet(node);
        const [gridMap] = computeTableMap(gridNode, node, node);
        // TODO this function expects Tables to be normalized. Look into this once it exists
        const rowsCount = gridMap.length;
        const columnsCount = gridMap[0].length;
        let row = gridNode.getFirstChild();
        if (!isTableRowNode(row)) {
          throw new Error('Expected TableNode first child to be a RowNode');
        }
        const unmerged = [];
        for (let i = 0; i < rowsCount; i++) {
          if (i !== 0) {
            row = row!.getNextSibling();
            if (!isTableRowNode(row)) {
              throw new Error('Expected TableNode first child to be a RowNode');
            }
          }
          let lastRowCell: null | TableCellNode = null;
          for (let j = 0; j < columnsCount; j++) {
            const cellMap = gridMap[i][j];
            const cell = cellMap.cell;
            if (cellMap.startRow === i && cellMap.startColumn === j) {
              lastRowCell = cell;
              unmerged.push(cell);
            } else if (cell.getColSpan() > 1 || cell.getRowSpan() > 1) {
              if (!isTableCellNode(cell)) {
                throw new Error(
                  'Expected TableNode cell to be a TableCellNode',
                );
              }
              const newCell = createTableCellNode(cell.__headerState);
              if (lastRowCell !== null) {
                lastRowCell.insertAfter(newCell);
              } else {
                insertFirst(row, newCell);
              }
            }
          }
        }
        for (const cell of unmerged) {
          cell.setColSpan(1);
          cell.setRowSpan(1);
        }
      }
    });
  }
  // Remove cell background color when feature is disabled
  function removeCellColorNodeTransform() {
    if (hasCellBackgroundColor) {
      return () => {
        // intentionally empty
      };
    }
    return editor.registerNodeTransform(TableCellNode, (node) => {
      if (node.getBackgroundColor() !== null) {
        node.setBackgroundColor(null);
      }
    });
  }
</script>
