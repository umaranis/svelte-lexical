<script lang="ts">
    import ColorPickerDialog from "$lib/components/generic/colorpicker/ColorPickerDialog.svelte";
    import { getEditor } from "$lib/core/composerContext.js";
    import  { TableCellNode } from "@lexical/table";
    import { $getSelection as getSelection, $isRangeSelection as isRangeSelection, type LexicalEditor, $getRoot as getRoot } from "lexical";
import {$isTableSelection as isTableSelection,
  $getNodeTriplet as getNodeTriplet,
  $isTableCellNode as isTableCellNode,
  type TableSelection,
  $getTableNodeFromLexicalNodeOrThrow as getTableNodeFromLexicalNodeOrThrow,
  type HTMLTableElementWithWithTableSelectionState,
getTableObserverFromTableElement,
} from '@lexical/table';
    import { onMount } from "svelte";
    import { mergeRegister } from "@lexical/utils";
  export let onClose : () => void;
  export let _tableCellNode: TableCellNode;
  export let setIsMenuOpen: (isOpen: boolean) => void;
  export let contextRef: null | HTMLElement;
  export let cellMerge : boolean;

  let colorPicker: HTMLElement;

  const editor = getEditor();
  const dropDownRef : HTMLDivElement ;
      let tableCellNode  = _tableCellNode;
  let selectionCounts = ({
    columns: 1,
    rows: 1,
  });
  let canMergeCells = (false);
  let canUnmergeCell = (false);

  function currentCellBackgroundColor(editor: LexicalEditor): null | string {
  return editor.getEditorState().read(() => {
    const selection = getSelection();
    if (isRangeSelection(selection) || isTableSelection(selection)) {
      const [cell] = getNodeTriplet(selection.anchor);
      if (isTableCellNode(cell)) {
        return cell.getBackgroundColor();
      }
    }
    return null;
  });
}


function computeSelectionCount(selection: TableSelection): {
  columns: number;
  rows: number;
} {
  const selectionShape = selection.getShape();
  return {
    columns: selectionShape.toX - selectionShape.fromX + 1,
    rows: selectionShape.toY - selectionShape.fromY + 1,
  };
}

function canUnmerge(): boolean {
  const selection = getSelection();
  if (
    (isRangeSelection(selection) && !selection.isCollapsed()) ||
    (isTableSelection(selection) && !selection.anchor.is(selection.focus)) ||
    (!isRangeSelection(selection) && !isTableSelection(selection))
  ) {
    return false;
  }
  const [cell] = getNodeTriplet(selection.anchor);
  return cell.__colSpan > 1 || cell.__rowSpan > 1;
}
  
  let backgroundColor = currentCellBackgroundColor(editor) || '';

  onMount(() => {
editor.getEditorState().read(() => {
      const selection = getSelection();
      // Merge cells
      if (isTableSelection(selection)) {
        const currentSelectionCounts = computeSelectionCount(selection);
        selectionCounts=(computeSelectionCount(selection));
        canMergeCells = 
          currentSelectionCounts.columns > 1 || currentSelectionCounts.rows > 1;
      }
      // Unmerge cell
      canUnmergeCell = (canUnmerge());
    });

    return mergeRegister(
          editor.registerMutationListener(
      TableCellNode,
      (nodeMutations) => {
        const nodeUpdated =
          nodeMutations.get(tableCellNode.getKey()) === 'updated';

        if (nodeUpdated) {
          editor.getEditorState().read(() => {
            tableCellNode=(tableCellNode.getLatest());
          });
          backgroundColor=(currentCellBackgroundColor(editor) || '');
        }
      },
      {skipInitialization: true},
    ),
    ) 
  }
  );
  
  

  onMount(() => {
    const menuButtonElement = contextRef;
    const dropDownElement = dropDownRef;
    const rootElement = editor.getRootElement();

    if (
      menuButtonElement != null &&
      dropDownElement != null &&
      rootElement != null
    ) {
      const rootEleRect = rootElement.getBoundingClientRect();
      const menuButtonRect = menuButtonElement.getBoundingClientRect();
      dropDownElement.style.opacity = '1';
      const dropDownElementRect = dropDownElement.getBoundingClientRect();
      const margin = 5;
      let leftPosition = menuButtonRect.right + margin;
      if (
        leftPosition + dropDownElementRect.width > window.innerWidth ||
        leftPosition + dropDownElementRect.width > rootEleRect.right
      ) {
        const position =
          menuButtonRect.left - dropDownElementRect.width - margin;
        leftPosition = (position < 0 ? margin : position) + window.pageXOffset;
      }
      dropDownElement.style.left = `${leftPosition + window.pageXOffset}px`;

      let topPosition = menuButtonRect.top;
      if (topPosition + dropDownElementRect.height > window.innerHeight) {
        const position = menuButtonRect.bottom - dropDownElementRect.height;
        topPosition = (position < 0 ? margin : position) + window.pageYOffset;
      }
      dropDownElement.style.top = `${topPosition + +window.pageYOffset}px`;
    }
  });

  onMount(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef != null &&
        contextRef != null &&
        !dropDownRef.contains(event.target as Node) &&
        !contextRef.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  });

  const clearTableSelection = () => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        const tableElement = editor.getElementByKey(
          tableNode.getKey(),
        ) as HTMLTableElementWithWithTableSelectionState;

        if (!tableElement) {
          throw new Error('Expected to find tableElement in DOM');
        }

        const tableObserver = getTableObserverFromTableElement(tableElement);
        if (tableObserver !== null) {
          tableObserver.clearHighlight();
        }

        tableNode.markDirty();
        tableCellNode=(tableCellNode.getLatest());
      }

      const rootNode = getRoot();
      rootNode.selectStart();
    });
  }

  const mergeTableCellsAtSelection = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isTableSelection(selection)) {
        const {columns, rows} = computeSelectionCount(selection);
        const nodes = selection.getNodes();
        let firstCell: null | TableCellNode = null;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if ($isTableCellNode(node)) {
            if (firstCell === null) {
              node.setColSpan(columns).setRowSpan(rows);
              firstCell = node;
              const isEmpty = $cellContainsEmptyParagraph(node);
              let firstChild;
              if (
                isEmpty &&
                $isParagraphNode((firstChild = node.getFirstChild()))
              ) {
                firstChild.remove();
              }
            } else if ($isTableCellNode(firstCell)) {
              const isEmpty = $cellContainsEmptyParagraph(node);
              if (!isEmpty) {
                firstCell.append(...node.getChildren());
              }
              node.remove();
            }
          }
        }
        if (firstCell !== null) {
          if (firstCell.getChildrenSize() === 0) {
            firstCell.append($createParagraphNode());
          }
          $selectLastDescendant(firstCell);
        }
        onClose();
      }
    });
  };

  const unmergeTableCellsAtSelection = () => {
    editor.update(() => {
      $unmergeCell();
    });
  };

  const insertTableRowAtSelection = useCallback(
    (shouldInsertAfter: boolean) => {
      editor.update(() => {
        $insertTableRow__EXPERIMENTAL(shouldInsertAfter);
        onClose();
      });
    },
    [editor, onClose],
  );

  const insertTableColumnAtSelection = useCallback(
    (shouldInsertAfter: boolean) => {
      editor.update(() => {
        for (let i = 0; i < selectionCounts.columns; i++) {
          $insertTableColumn__EXPERIMENTAL(shouldInsertAfter);
        }
        onClose();
      });
    },
    [editor, onClose, selectionCounts.columns],
  );

  const deleteTableRowAtSelection = useCallback(() => {
    editor.update(() => {
      $deleteTableRow__EXPERIMENTAL();
      onClose();
    });
  }, [editor, onClose]);

  const deleteTableAtSelection = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
      tableNode.remove();

      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  const deleteTableColumnAtSelection = useCallback(() => {
    editor.update(() => {
      $deleteTableColumn__EXPERIMENTAL();
      onClose();
    });
  }, [editor, onClose]);

  const toggleTableRowIsHeader = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

      const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);

      const tableRows = tableNode.getChildren();

      if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
        throw new Error('Expected table cell to be inside of table row.');
      }

      const tableRow = tableRows[tableRowIndex];

      if (!$isTableRowNode(tableRow)) {
        throw new Error('Expected table row');
      }

      const newStyle =
        tableCellNode.getHeaderStyles() ^ TableCellHeaderStates.ROW;
      tableRow.getChildren().forEach((tableCell) => {
        if (!$isTableCellNode(tableCell)) {
          throw new Error('Expected table cell');
        }

        tableCell.setHeaderStyles(newStyle, TableCellHeaderStates.ROW);
      });

      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  const toggleTableColumnIsHeader = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

      const tableColumnIndex =
        $getTableColumnIndexFromTableCellNode(tableCellNode);

      const tableRows = tableNode.getChildren<TableRowNode>();
      const maxRowsLength = Math.max(
        ...tableRows.map((row) => row.getChildren().length),
      );

      if (tableColumnIndex >= maxRowsLength || tableColumnIndex < 0) {
        throw new Error('Expected table cell to be inside of table row.');
      }

      const newStyle =
        tableCellNode.getHeaderStyles() ^ TableCellHeaderStates.COLUMN;
      for (let r = 0; r < tableRows.length; r++) {
        const tableRow = tableRows[r];

        if (!$isTableRowNode(tableRow)) {
          throw new Error('Expected table row');
        }

        const tableCells = tableRow.getChildren();
        if (tableColumnIndex >= tableCells.length) {
          // if cell is outside of bounds for the current row (for example various merge cell cases) we shouldn't highlight it
          continue;
        }

        const tableCell = tableCells[tableColumnIndex];

        if (!$isTableCellNode(tableCell)) {
          throw new Error('Expected table cell');
        }

        tableCell.setHeaderStyles(newStyle, TableCellHeaderStates.COLUMN);
      }
      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  const toggleRowStriping = useCallback(() => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        if (tableNode) {
          tableNode.setRowStriping(!tableNode.getRowStriping());
        }
      }
      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  const handleCellBackgroundColor = useCallback(
    (value: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) || $isTableSelection(selection)) {
          const [cell] = $getNodeTriplet(selection.anchor);
          if ($isTableCellNode(cell)) {
            cell.setBackgroundColor(value);
          }

          if ($isTableSelection(selection)) {
            const nodes = selection.getNodes();

            for (let i = 0; i <script nodes.length; i++) {
              const node = nodes[i];
              if ($isTableCellNode(node)) {
                node.setBackgroundColor(value);
              }
            }
          }
        }
      });
    },
    [editor],
  );

  let mergeCellButton: null | JSX.Element = null;
  if (cellMerge) {
    if (canMergeCells) {
      mergeCellButton = (
        <button
          type="button"
          class="item"
          on:click={() => mergeTableCellsAtSelection()}
          data-test-id="table-merge-cells">
          Merge cells
        </button>
      );
    } else if (canUnmergeCell) {
      mergeCellButton = (
        <button
          type="button"
          class="item"
          on:click={() => unmergeTableCellsAtSelection()}
          data-test-id="table-unmerge-cells">
          Unmerge cells
        </button>
      );
    }
  }
</script>

// eslint-disable-next-line jsx-a11y/no-static-element-interactions
<div
  class="dropdown"
  bind:this={dropDownRef}
  on:click={(e) => {
    e.stopPropagation();
  }}>
  {mergeCellButton}
  <button
    type="button"
    class="item"
    on:click={() => {
      colorPicker.open();
    }}
    data-test-id="table-background-color">
    <span class="text">Background color</span>
  </button>
  <button
    type="button"
    class="item"
    on:click={() => toggleRowStriping()}
    data-test-id="table-row-striping">
    <span class="text">Toggle Row Striping</span>
  </button>
  <hr />
  <button
    type="button"
    class="item"
    on:click={() => insertTableRowAtSelection(false)}
    data-test-id="table-insert-row-above">
    <span class="text">
      Insert{' '}
      {selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`}{' '}
      above
    </span>
  </button>
  <button
    type="button"
    class="item"
    on:click={() => insertTableRowAtSelection(true)}
    data-test-id="table-insert-row-below">
    <span class="text">
      Insert{' '}
      {selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`}{' '}
      below
    </span>
  </button>
  <hr />
  <button
    type="button"
    class="item"
    on:click={() => insertTableColumnAtSelection(false)}
    data-test-id="table-insert-column-before">
    <span class="text">
      Insert{' '}
      {selectionCounts.columns === 1
        ? 'column'
        : `${selectionCounts.columns} columns`}{' '}
      left
    </span>
  </button>
  <button
    type="button"
    class="item"
    on:click={() => insertTableColumnAtSelection(true)}
    data-test-id="table-insert-column-after">
    <span class="text">
      Insert{' '}
      {selectionCounts.columns === 1
        ? 'column'
        : `${selectionCounts.columns} columns`}{' '}
      right
    </span>
  </button>
  <hr />
  <button
    type="button"
    class="item"
    on:click={() => deleteTableColumnAtSelection()}
    data-test-id="table-delete-columns">
    <span class="text">Delete column</span>
  </button>
  <button
    type="button"
    class="item"
    on:click={() => deleteTableRowAtSelection()}
    data-test-id="table-delete-rows">
    <span class="text">Delete row</span>
  </button>
  <button
    type="button"
    class="item"
    on:click={() => deleteTableAtSelection()}
    data-test-id="table-delete">
    <span class="text">Delete table</span>
  </button>
  <hr />
  <button type="button" class="item" on:click={() => toggleTableRowIsHeader()}>
    <span class="text">
      {(tableCellNode.__headerState & TableCellHeaderStates.ROW) ===
      TableCellHeaderStates.ROW
        ? 'Remove'
        : 'Add'}{' '}
      row header
    </span>
  </button>
  <button
    type="button"
    class="item"
    on:click={() => toggleTableColumnIsHeader()}
    data-test-id="table-column-header">
    <span class="text">
      {(tableCellNode.__headerState & TableCellHeaderStates.COLUMN) ===
      TableCellHeaderStates.COLUMN
        ? 'Remove'
        : 'Add'}{' '}
      column header
    </span>
  </button>
</div>

<ColorPickerDialog
  title="Cell background color"
  color={backgroundColor}
  onChange={handleCellBackgroundColor}
  bind:this={colorPicker} />
