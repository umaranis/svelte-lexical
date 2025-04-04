<script lang="ts">
  import {run} from 'svelte/legacy';

  import {getEditor} from '$lib/core/composerContext.js';
  import {
    $unmergeCell as unmergeCell,
    TableCellNode,
    $insertTableRow__EXPERIMENTAL as insertTableRow__EXPERIMENTAL,
    $insertTableColumn__EXPERIMENTAL as insertTableColumn__EXPERIMENTAL,
    $deleteTableRow__EXPERIMENTAL as deleteTableRow__EXPERIMENTAL,
    $deleteTableColumn__EXPERIMENTAL as deleteTableColumn__EXPERIMENTAL,
    $getTableRowIndexFromTableCellNode as getTableRowIndexFromTableCellNode,
    TableCellHeaderStates,
    $getTableColumnIndexFromTableCellNode as getTableColumnIndexFromTableCellNode,
    getTableElement,
    $computeTableMapSkipCellCheck as computeTableMapSkipCellCheck,
  } from '@lexical/table';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    type LexicalEditor,
    $setSelection as setSelection,
    $isParagraphNode as isParagraphNode,
    $createParagraphNode as createParagraphNode,
    ElementNode,
    $isTextNode as isTextNode,
    $isElementNode as isElementNode,
    isDOMNode,
  } from 'lexical';
  import {
    $isTableSelection as isTableSelection,
    $getNodeTriplet as getNodeTriplet,
    $isTableCellNode as isTableCellNode,
    type TableSelection,
    $getTableNodeFromLexicalNodeOrThrow as getTableNodeFromLexicalNodeOrThrow,
    getTableObserverFromTableElement,
  } from '@lexical/table';
  import {onMount} from 'svelte';
  import {mergeRegister} from '@lexical/utils';
  import {writable} from 'svelte/store';
  import Portal from '$lib/components/generic/portal/Portal.svelte';
  import DropDown from '$lib/components/generic/dropdown/DropDown.svelte';
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';
  import ColorPickerDialog from '$lib/components/generic/colorpicker/ColorPickerDialog.svelte';
  interface Props {
    onClose: () => void;
    _tableCellNode: TableCellNode;
    setIsMenuOpen: (isOpen: boolean) => void;
    contextRef: null | HTMLElement;
    cellMerge: boolean;
    colorPicker: ColorPickerDialog;
  }

  let {
    onClose,
    _tableCellNode,
    setIsMenuOpen,
    contextRef,
    cellMerge,
    colorPicker,
  }: Props = $props();

  const editor = getEditor();
  let dropDownRef: HTMLDivElement | null = $state(null);
  let tableCellNode = $state(_tableCellNode);
  let selectionCounts = $state({
    columns: 1,
    rows: 1,
  });
  let canMergeCells = $state(false);
  let canUnmergeCell = $state(false);

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

  function cellContainsEmptyParagraph(cell: TableCellNode): boolean {
    if (cell.getChildrenSize() !== 1) {
      return false;
    }
    const firstChild = cell.getFirstChildOrThrow();
    if (!isParagraphNode(firstChild) || !firstChild.isEmpty()) {
      return false;
    }
    return true;
  }

  function selectLastDescendant(node: ElementNode): void {
    const lastDescendant = node.getLastDescendant();
    if (isTextNode(lastDescendant)) {
      lastDescendant.select();
    } else if (isElementNode(lastDescendant)) {
      lastDescendant.selectEnd();
    } else if (lastDescendant !== null) {
      lastDescendant.selectNext();
    }
  }

  let backgroundColor = writable(currentCellBackgroundColor(editor) || '');

  onMount(() => {
    editor.getEditorState().read(() => {
      const selection = getSelection();
      // Merge cells
      if (isTableSelection(selection)) {
        const currentSelectionCounts = computeSelectionCount(selection);
        selectionCounts = computeSelectionCount(selection);
        canMergeCells =
          currentSelectionCounts.columns > 1 || currentSelectionCounts.rows > 1;
      }
      // Unmerge cell
      canUnmergeCell = canUnmerge();
    });

    return mergeRegister(
      editor.registerMutationListener(
        TableCellNode,
        (nodeMutations) => {
          const nodeUpdated =
            nodeMutations.get(tableCellNode.getKey()) === 'updated';

          if (nodeUpdated) {
            editor.getEditorState().read(() => {
              tableCellNode = tableCellNode.getLatest();
            });
            $backgroundColor = currentCellBackgroundColor(editor) || '';
          }
        },
        {skipInitialization: true},
      ),
    );
  });

  run(() => {
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
        topPosition = position < 0 ? margin : position;
      }
      dropDownElement.style.top = `${topPosition}px`;
    }
  });

  function handleClickOutside(event: MouseEvent) {
    if (
      dropDownRef != null &&
      contextRef != null &&
      isDOMNode(event.target) &&
      !dropDownRef.contains(event.target) &&
      !contextRef.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  }

  onMount(() => {
    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  });

  const clearTableSelection = () => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        const tableElement = getTableElement(
          tableNode,
          editor.getElementByKey(tableNode.getKey()),
        );

        if (!tableElement) {
          throw new Error('Expected to find tableElement in DOM');
        }

        const tableObserver = getTableObserverFromTableElement(tableElement);
        if (tableObserver !== null) {
          tableObserver.$clearHighlight();
        }

        tableNode.markDirty();
        tableCellNode = tableCellNode.getLatest();
      }
      setSelection(null);
    });
  };

  const mergeTableCellsAtSelection = () => {
    editor.update(() => {
      const selection = getSelection();
      if (isTableSelection(selection)) {
        // Get all selected cells and compute the total area
        const nodes = selection.getNodes();
        const tableCells = nodes.filter(isTableCellNode);

        if (tableCells.length === 0) {
          return;
        }

        // Find the table node
        const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCells[0]);
        const [gridMap] = computeTableMapSkipCellCheck(tableNode, null, null);

        // Find the boundaries of the selection including merged cells
        let minRow = Infinity;
        let maxRow = -Infinity;
        let minCol = Infinity;
        let maxCol = -Infinity;

        // First pass: find the actual boundaries considering merged cells
        const processedCells = new Set();
        for (const row of gridMap) {
          for (const mapCell of row) {
            if (!mapCell || !mapCell.cell) {
              continue;
            }

            const cellKey = mapCell.cell.getKey();
            if (processedCells.has(cellKey)) {
              continue;
            }

            if (tableCells.some((cell) => cell.is(mapCell.cell))) {
              processedCells.add(cellKey);
              // Get the actual position of this cell in the grid
              const cellStartRow = mapCell.startRow;
              const cellStartCol = mapCell.startColumn;
              const cellRowSpan = mapCell.cell.__rowSpan || 1;
              const cellColSpan = mapCell.cell.__colSpan || 1;

              // Update boundaries considering the cell's actual position and span
              minRow = Math.min(minRow, cellStartRow);
              maxRow = Math.max(maxRow, cellStartRow + cellRowSpan - 1);
              minCol = Math.min(minCol, cellStartCol);
              maxCol = Math.max(maxCol, cellStartCol + cellColSpan - 1);
            }
          }
        }

        // Validate boundaries
        if (minRow === Infinity || minCol === Infinity) {
          return;
        }

        // The total span of the merged cell
        const totalRowSpan = maxRow - minRow + 1;
        const totalColSpan = maxCol - minCol + 1;

        // Use the top-left cell as the target cell
        const targetCellMap = gridMap[minRow][minCol];
        if (!targetCellMap?.cell) {
          return;
        }
        const targetCell = targetCellMap.cell;

        // Set the spans for the target cell
        targetCell.setColSpan(totalColSpan);
        targetCell.setRowSpan(totalRowSpan);

        // Move content from other cells to the target cell
        const seenCells = new Set([targetCell.getKey()]);

        // Second pass: merge content and remove other cells
        for (let row = minRow; row <= maxRow; row++) {
          for (let col = minCol; col <= maxCol; col++) {
            const mapCell = gridMap[row][col];
            if (!mapCell?.cell) {
              continue;
            }

            const currentCell = mapCell.cell;
            const key = currentCell.getKey();

            if (!seenCells.has(key)) {
              seenCells.add(key);
              const isEmpty = cellContainsEmptyParagraph(currentCell);
              if (!isEmpty) {
                targetCell.append(...currentCell.getChildren());
              }
              currentCell.remove();
            }
          }
        }

        // Ensure target cell has content
        if (targetCell.getChildrenSize() === 0) {
          targetCell.append(createParagraphNode());
        }

        selectLastDescendant(targetCell);
        onClose();
      }
    });
  };

  const unmergeTableCellsAtSelection = () => {
    editor.update(() => {
      unmergeCell();
    });
  };

  const insertTableRowAtSelection = (shouldInsertAfter: boolean) => {
    editor.update(() => {
      for (let i = 0; i < selectionCounts.rows; i++) {
        insertTableRow__EXPERIMENTAL(shouldInsertAfter);
      }
      onClose();
    });
  };

  const insertTableColumnAtSelection = (shouldInsertAfter: boolean) => {
    editor.update(() => {
      for (let i = 0; i < selectionCounts.columns; i++) {
        insertTableColumn__EXPERIMENTAL(shouldInsertAfter);
      }
      onClose();
    });
  };

  const deleteTableRowAtSelection = () => {
    editor.update(() => {
      deleteTableRow__EXPERIMENTAL();
      onClose();
    });
  };

  const deleteTableAtSelection = () => {
    editor.update(() => {
      const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
      tableNode.remove();

      clearTableSelection();
      onClose();
    });
  };

  const deleteTableColumnAtSelection = () => {
    editor.update(() => {
      deleteTableColumn__EXPERIMENTAL();
      onClose();
    });
  };

  const toggleTableRowIsHeader = () => {
    editor.update(() => {
      const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);

      const tableRowIndex = getTableRowIndexFromTableCellNode(tableCellNode);

      const [gridMap] = computeTableMapSkipCellCheck(tableNode, null, null);

      const rowCells = new Set<TableCellNode>();

      const newStyle =
        tableCellNode.getHeaderStyles() ^ TableCellHeaderStates.ROW;

      for (let col = 0; col < gridMap[tableRowIndex].length; col++) {
        const mapCell = gridMap[tableRowIndex][col];

        if (!mapCell?.cell) {
          continue;
        }

        if (!rowCells.has(mapCell.cell)) {
          rowCells.add(mapCell.cell);
          mapCell.cell.setHeaderStyles(newStyle, TableCellHeaderStates.ROW);
        }
      }
      clearTableSelection();
      onClose();
    });
  };

  const toggleTableColumnIsHeader = () => {
    editor.update(() => {
      const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);

      const tableColumnIndex =
        getTableColumnIndexFromTableCellNode(tableCellNode);

      const [gridMap] = computeTableMapSkipCellCheck(tableNode, null, null);

      const columnCells = new Set<TableCellNode>();
      const newStyle =
        tableCellNode.getHeaderStyles() ^ TableCellHeaderStates.COLUMN;

      for (let row = 0; row < gridMap.length; row++) {
        const mapCell = gridMap[row][tableColumnIndex];

        if (!mapCell?.cell) {
          continue;
        }

        if (!columnCells.has(mapCell.cell)) {
          columnCells.add(mapCell.cell);
          mapCell.cell.setHeaderStyles(newStyle, TableCellHeaderStates.COLUMN);
        }
      }
      clearTableSelection();
      onClose();
    });
  };

  const toggleRowStriping = () => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        if (tableNode) {
          tableNode.setRowStriping(!tableNode.getRowStriping());
        }
      }
      clearTableSelection();
      onClose();
    });
  };

  const toggleFirstRowFreeze = () => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        if (tableNode) {
          tableNode.setFrozenRows(tableNode.getFrozenRows() === 0 ? 1 : 0);
        }
      }
      clearTableSelection();
      onClose();
    });
  };

  const toggleFirstColumnFreeze = () => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        if (tableNode) {
          tableNode.setFrozenColumns(
            tableNode.getFrozenColumns() === 0 ? 1 : 0,
          );
        }
      }
      clearTableSelection();
      onClose();
    });
  };

  const handleCellBackgroundColor = (value: string) => {
    editor.update(() => {
      const selection = getSelection();
      if (isRangeSelection(selection) || isTableSelection(selection)) {
        const [cell] = getNodeTriplet(selection.anchor);
        if (isTableCellNode(cell)) {
          cell.setBackgroundColor(value);
        }
        if (isTableSelection(selection)) {
          const nodes = selection.getNodes();
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (isTableCellNode(node)) {
              node.setBackgroundColor(value);
            }
          }
        }
      }
    });
  };

  const formatVerticalAlign = (value: string) => {
    editor.update(() => {
      const selection = getSelection();
      if (isRangeSelection(selection) || isTableSelection(selection)) {
        const [cell] = getNodeTriplet(selection.anchor);
        if (isTableCellNode(cell)) {
          cell.setVerticalAlign(value);
        }

        if (isTableSelection(selection)) {
          const nodes = selection.getNodes();

          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (isTableCellNode(node)) {
              node.setVerticalAlign(value);
            }
          }
        }
      }
    });
  };
</script>

<Portal>
  <!-- eslint-disable-next-line jsx-a11y/no-static-element-interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="dropdown svelte-lexical"
    bind:this={dropDownRef}
    onclick={(e) => {
      e.stopPropagation();
    }}>
    {#if cellMerge}
      {#if canMergeCells}
        <button
          type="button"
          class="item"
          onclick={() => mergeTableCellsAtSelection()}
          data-test-id="table-merge-cells">
          <span class="text">Merge cells</span>
        </button>
      {:else if canUnmergeCell}
        <button
          type="button"
          class="item"
          onclick={() => unmergeTableCellsAtSelection()}
          data-test-id="table-unmerge-cells">
          <span class="text">Unmerge cells</span>
        </button>
      {/if}
    {/if}
    <button
      type="button"
      class="item"
      onclick={() => {
        setIsMenuOpen(false);
        colorPicker.open(handleCellBackgroundColor, $backgroundColor);
      }}
      data-test-id="table-background-color">
      <span class="text">Background color</span>
    </button>
    <button
      type="button"
      class="item"
      onclick={() => toggleRowStriping()}
      data-test-id="table-row-striping">
      <span class="text">Toggle Row Striping</span>
    </button>
    <DropDown
      buttonLabel="Vertical Align"
      buttonClassName="item"
      buttonAriaLabel="Formatting options for vertical alignment">
      <DropDownItem
        onclick={() => {
          formatVerticalAlign('top');
        }}
        class="item wide">
        <div class="icon-text-container">
          <i class="icon vertical-top"></i>
          <span class="text">Top Align</span>
        </div>
      </DropDownItem>
      <DropDownItem
        onclick={() => {
          formatVerticalAlign('middle');
        }}
        class="item wide">
        <div class="icon-text-container">
          <i class="icon vertical-middle"></i>
          <span class="text">Middle Align</span>
        </div>
      </DropDownItem>
      <DropDownItem
        onclick={() => {
          formatVerticalAlign('bottom');
        }}
        class="item wide">
        <div class="icon-text-container">
          <i class="icon vertical-bottom"></i>
          <span class="text">Bottom Align</span>
        </div>
      </DropDownItem>
    </DropDown>
    <button
      type="button"
      class="item"
      onclick={() => toggleFirstRowFreeze()}
      data-test-id="table-freeze-first-row">
      <span class="text">Toggle First Row Freeze</span>
    </button>
    <button
      type="button"
      class="item"
      onclick={() => toggleFirstColumnFreeze()}
      data-test-id="table-freeze-first-column">
      <span class="text">Toggle First Column Freeze</span>
    </button>
    <hr />
    <button
      type="button"
      class="item"
      onclick={() => insertTableRowAtSelection(false)}
      data-test-id="table-insert-row-above">
      <span class="text">
        Insert
        {selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`}
        above
      </span>
    </button>
    <button
      type="button"
      class="item"
      onclick={() => insertTableRowAtSelection(true)}
      data-test-id="table-insert-row-below">
      <span class="text">
        Insert
        {selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`}
        below
      </span>
    </button>
    <hr />
    <button
      type="button"
      class="item"
      onclick={() => insertTableColumnAtSelection(false)}
      data-test-id="table-insert-column-before">
      <span class="text">
        Insert
        {selectionCounts.columns === 1
          ? 'column'
          : `${selectionCounts.columns} columns`}
        left
      </span>
    </button>
    <button
      type="button"
      class="item"
      onclick={() => insertTableColumnAtSelection(true)}
      data-test-id="table-insert-column-after">
      <span class="text">
        Insert
        {selectionCounts.columns === 1
          ? 'column'
          : `${selectionCounts.columns} columns`}
        right
      </span>
    </button>
    <hr />
    <button
      type="button"
      class="item"
      onclick={() => deleteTableColumnAtSelection()}
      data-test-id="table-delete-columns">
      <span class="text">Delete column</span>
    </button>
    <button
      type="button"
      class="item"
      onclick={() => deleteTableRowAtSelection()}
      data-test-id="table-delete-rows">
      <span class="text">Delete row</span>
    </button>
    <button
      type="button"
      class="item"
      onclick={() => deleteTableAtSelection()}
      data-test-id="table-delete">
      <span class="text">Delete table</span>
    </button>
    <hr />
    <button
      type="button"
      class="item"
      onclick={() => toggleTableRowIsHeader()}
      data-test-id="table-row-header">
      <span class="text">
        {(tableCellNode.__headerState & TableCellHeaderStates.ROW) ===
        TableCellHeaderStates.ROW
          ? 'Remove'
          : 'Add'}
        row header
      </span>
    </button>
    <button
      type="button"
      class="item"
      onclick={() => toggleTableColumnIsHeader()}
      data-test-id="table-column-header">
      <span class="text">
        {(tableCellNode.__headerState & TableCellHeaderStates.COLUMN) ===
        TableCellHeaderStates.COLUMN
          ? 'Remove'
          : 'Add'}
        column header
      </span>
    </button>
  </div>
</Portal>
