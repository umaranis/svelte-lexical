<script lang="ts">
  import {
    $computeTableMapSkipCellCheck as computeTableMapSkipCellCheck,
    $insertTableColumnAtSelection as insertTableColumnAtSelection,
    $insertTableRowAtSelection as insertTableRowAtSelection,
    $isSimpleTable as isSimpleTable,
    $isTableCellNode as isTableCellNode,
    $isTableNode as isTableNode,
    $isTableRowNode as isTableRowNode,
    $moveTableColumn as moveTableColumn,
  } from '@lexical/table';
  import {calculateZoomLevel, CAN_USE_DOM} from '@lexical/utils';
  import {
    $getChildCaret as getChildCaret,
    $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
    $getSiblingCaret as getSiblingCaret,
    isHTMLElement,
  } from 'lexical';
  import {getEditor, getIsEditable} from '$lib/core/composerContext.js';
  import Portal from '$lib/components/generic/portal/Portal.svelte';
  import DropDown from '$lib/components/generic/dropdown/DropDown.svelte';
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';
  import {getThemeSelector} from '../util/getThemeSelector.js';

  const INDICATOR_SIZE_PX = 18;
  const SIDE_INDICATOR_SIZE_PX = 18;
  const TOP_BUTTON_OVERHANG = INDICATOR_SIZE_PX / 2;
  const LEFT_BUTTON_OVERHANG = SIDE_INDICATOR_SIZE_PX / 2;
  const SHIFT_PADDING = 8;
  const COLUMN_DRAG_MIME_TYPE = 'application/x-lexical-table-column';

  type ColumnDragData = {
    columnIndex: number;
    tableKey: string | null;
  };

  type DropIndicatorState = {
    edge: 'left' | 'right';
    height: number;
    left: number;
    top: number;
  };

  interface Props {
    anchorElem?: HTMLElement;
  }

  let {anchorElem = globalThis.document?.body}: Props = $props();

  const editor = getEditor();
  const isEditable = getIsEditable();

  let isVisible = $state(false);
  let isLeftVisible = $state(false);
  let topStyle = $state('');
  let leftStyle = $state('');
  let floatingElem: HTMLDivElement | null = $state(null);
  let leftFloatingElem: HTMLButtonElement | null = $state(null);
  let hoveredTopCell: HTMLTableCellElement | null = null;
  let hoveredLeftCell: HTMLTableCellElement | null = null;
  let hoveredTable: HTMLTableElement | null = $state(null);
  let hoveredColumnIndex: number | null = $state(null);
  let canReorder = $state(false);
  let dropIndicatorState: DropIndicatorState | null = $state(null);
  let columnDragData: ColumnDragData | null = null;

  function getCellSelector(): string {
    const themeSelector = getThemeSelector(editor._config.theme.tableCell);
    return `td${themeSelector}, th${themeSelector}`;
  }

  function getTableFromMouseEvent(event: MouseEvent): {
    isOutside: boolean;
    tableElement: HTMLTableElement | null;
  } {
    if (!isHTMLElement(event.target)) {
      return {isOutside: true, tableElement: null};
    }

    const cell = event.target.closest<HTMLTableCellElement>(getCellSelector());
    const tableElement = cell?.closest<HTMLTableElement>('table') ?? null;

    return {
      isOutside: tableElement == null,
      tableElement,
    };
  }

  function getClosestTopCellPosition(
    tableElement: HTMLTableElement,
    clientX: number,
  ): {centerX: number; top: number; cell: HTMLTableCellElement} | null {
    const firstRow = tableElement.rows[0];
    if (!firstRow) {
      return null;
    }

    let closest: {
      cell: HTMLTableCellElement;
      centerX: number;
      top: number;
    } | null = null;
    let smallestDelta = Number.POSITIVE_INFINITY;

    for (const cell of Array.from(firstRow.cells)) {
      const rect = cell.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const delta = Math.abs(centerX - clientX);
      if (delta < smallestDelta) {
        smallestDelta = delta;
        closest = {cell, centerX, top: rect.top};
      }
    }

    return closest;
  }

  function isTableFromEditor(tableElement: HTMLTableElement | null): boolean {
    const root = editor.getRootElement();
    return !!root && !!tableElement && root.contains(tableElement);
  }

  function getTableKey(tableElement: HTMLTableElement | null): string | null {
    return tableElement?.getAttribute('data-lexical-key') ?? null;
  }

  function getBoundaryIndex(
    cell: HTMLTableCellElement,
    clientX: number,
  ): number {
    const rect = cell.getBoundingClientRect();
    const isRightHalf = clientX > rect.left + rect.width / 2;
    const cellIndex = cell.cellIndex ?? 0;
    return cellIndex + (isRightHalf ? 1 : 0);
  }

  function getDropIndicatorState(
    headerRow: HTMLTableRowElement,
    tableRect: DOMRect,
    boundaryIndex: number,
  ): DropIndicatorState | null {
    const cellCount = headerRow.cells.length;
    if (cellCount === 0) {
      return null;
    }
    const clampedIndex = Math.max(0, Math.min(boundaryIndex, cellCount));
    if (clampedIndex === cellCount) {
      const lastRect = headerRow.cells[cellCount - 1].getBoundingClientRect();
      return {
        edge: 'right',
        height: tableRect.height,
        left: lastRect.right,
        top: tableRect.top,
      };
    }
    const targetRect = headerRow.cells[clampedIndex].getBoundingClientRect();
    return {
      edge: 'left',
      height: tableRect.height,
      left: targetRect.left,
      top: tableRect.top,
    };
  }

  function getHeaderCellFromDragEvent(
    tableElement: HTMLTableElement,
    event: DragEvent,
  ): HTMLTableCellElement | null {
    const headerRow = tableElement.rows[0];
    if (!headerRow || !isHTMLElement(event.target)) {
      return null;
    }
    const cell = event.target.closest<HTMLTableCellElement>('td, th');
    return cell && cell.parentElement === headerRow ? cell : null;
  }

  function isColumnDrag(tableKey: string | null): boolean {
    return columnDragData != null && columnDragData.tableKey === tableKey;
  }

  function clamp(value: number, size: number, viewportSize: number): number {
    return Math.max(
      SHIFT_PADDING,
      Math.min(value, viewportSize - size - SHIFT_PADDING),
    );
  }

  // placement top, negative offset so the button overhangs the table's top border, shift with padding
  function getTopStyle(centerX: number, top: number): string {
    const zoom = calculateZoomLevel(anchorElem, true);
    const width =
      floatingElem?.getBoundingClientRect().width || INDICATOR_SIZE_PX;
    const left = clamp(centerX - width / 2, width, window.innerWidth);
    const y = top - INDICATOR_SIZE_PX + TOP_BUTTON_OVERHANG;
    return `top: ${y / zoom}px; left: ${left / zoom}px;`;
  }

  // placement left, negative offset so the button overhangs the table's left border, shift with padding
  function getLeftStyle(tableLeft: number, centerY: number): string {
    const zoom = calculateZoomLevel(anchorElem, true);
    const top = clamp(
      centerY - SIDE_INDICATOR_SIZE_PX / 2,
      SIDE_INDICATOR_SIZE_PX,
      window.innerHeight,
    );
    const x = tableLeft - SIDE_INDICATOR_SIZE_PX + LEFT_BUTTON_OVERHANG;
    return `top: ${top / zoom}px; left: ${x / zoom}px;`;
  }

  $effect(() => {
    if (!CAN_USE_DOM || !$isEditable) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (
        (floatingElem &&
          event.target instanceof Node &&
          floatingElem.contains(event.target)) ||
        (leftFloatingElem &&
          event.target instanceof Node &&
          leftFloatingElem.contains(event.target))
      ) {
        return;
      }

      const {tableElement, isOutside} = getTableFromMouseEvent(event);

      if (
        isOutside ||
        tableElement == null ||
        (anchorElem && !anchorElem.contains(tableElement))
      ) {
        isVisible = false;
        isLeftVisible = false;
        hoveredTable = null;
        hoveredColumnIndex = null;
        dropIndicatorState = null;
        return;
      }

      const hoveredCell = isHTMLElement(event.target)
        ? event.target.closest<HTMLTableCellElement>(getCellSelector())
        : null;

      if (!hoveredCell) {
        isVisible = false;
        isLeftVisible = false;
        hoveredTopCell = null;
        hoveredLeftCell = null;
        return;
      }

      const rowIndex =
        hoveredCell.parentElement instanceof HTMLTableRowElement
          ? hoveredCell.parentElement.rowIndex
          : -1;
      const colIndex = hoveredCell.cellIndex ?? -1;

      const closestTopCell = getClosestTopCellPosition(
        tableElement,
        event.clientX,
      );

      if (!closestTopCell || rowIndex !== 0) {
        isVisible = false;
        hoveredTopCell = null;
        hoveredTable = null;
        hoveredColumnIndex = null;
      } else {
        hoveredTopCell = closestTopCell.cell;
        hoveredTable = tableElement;
        hoveredColumnIndex = closestTopCell.cell.cellIndex ?? null;
        topStyle = getTopStyle(closestTopCell.centerX, closestTopCell.top);
        isVisible = true;
      }

      const tableRect = tableElement.getBoundingClientRect();
      if (colIndex !== 0) {
        isLeftVisible = false;
        hoveredLeftCell = null;
      } else {
        const {top, height} = hoveredCell.getBoundingClientRect();
        hoveredLeftCell = hoveredCell;
        leftStyle = getLeftStyle(tableRect.left, top + height / 2);
        isLeftVisible = true;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      isVisible = false;
      isLeftVisible = false;
    };
  });

  $effect(() => {
    const handleMouseLeave = (event: MouseEvent) => {
      const nextTarget = event.relatedTarget;
      if (
        nextTarget &&
        floatingElem &&
        floatingElem.contains(nextTarget as Node)
      ) {
        return;
      }
      if (
        nextTarget &&
        leftFloatingElem &&
        leftFloatingElem.contains(nextTarget as Node)
      ) {
        return;
      }
      isVisible = false;
      isLeftVisible = false;
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement) {
        prevRootElement.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (rootElement) {
        rootElement.addEventListener('mouseleave', handleMouseLeave);
      }
    });
  });

  $effect(() => {
    const tableElement = hoveredTable;
    if (!tableElement || !isTableFromEditor(tableElement)) {
      canReorder = false;
      return;
    }
    canReorder = editor.getEditorState().read(
      () => {
        const tableNode = getNearestNodeFromDOMNode(tableElement);
        return isTableNode(tableNode) && isSimpleTable(tableNode);
      },
      {editor},
    );
  });

  $effect(() => {
    const tableElement = hoveredTable;
    if (!tableElement || !canReorder || !isTableFromEditor(tableElement)) {
      return;
    }
    const tableKey = getTableKey(tableElement);

    const handleDragOver = (event: DragEvent) => {
      if (!isColumnDrag(tableKey)) {
        return;
      }
      const cell = getHeaderCellFromDragEvent(tableElement, event);
      if (!cell) {
        dropIndicatorState = null;
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
      dropIndicatorState = getDropIndicatorState(
        tableElement.rows[0],
        tableElement.getBoundingClientRect(),
        getBoundaryIndex(cell, event.clientX),
      );
    };

    const handleDragLeave = (event: DragEvent) => {
      const nextTarget = event.relatedTarget;
      if (!(nextTarget instanceof Node) || !tableElement.contains(nextTarget)) {
        dropIndicatorState = null;
      }
    };

    const handleDrop = (event: DragEvent) => {
      const data = columnDragData;
      if (!data || !isColumnDrag(tableKey)) {
        return;
      }
      const cell = getHeaderCellFromDragEvent(tableElement, event);
      if (!cell) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      dropIndicatorState = null;
      const boundaryIndex = getBoundaryIndex(cell, event.clientX);
      editor.update(() => {
        const tableNode = getNearestNodeFromDOMNode(tableElement);
        if (!isTableNode(tableNode)) {
          return;
        }
        const columnCount = tableNode.getColumnCount();
        const clampedBoundary = Math.max(
          0,
          Math.min(boundaryIndex, columnCount),
        );
        const startIndex = data.columnIndex;
        if (
          clampedBoundary === startIndex ||
          clampedBoundary === startIndex + 1 ||
          startIndex < 0 ||
          startIndex >= columnCount
        ) {
          return;
        }
        const finishIndex =
          clampedBoundary > startIndex ? clampedBoundary - 1 : clampedBoundary;
        moveTableColumn(tableNode, startIndex, finishIndex);
      });
    };

    tableElement.addEventListener('dragover', handleDragOver);
    tableElement.addEventListener('dragleave', handleDragLeave);
    tableElement.addEventListener('drop', handleDrop);

    return () => {
      tableElement.removeEventListener('dragover', handleDragOver);
      tableElement.removeEventListener('dragleave', handleDragLeave);
      tableElement.removeEventListener('drop', handleDrop);
      dropIndicatorState = null;
    };
  });

  const handleColumnDragStart = (event: DragEvent) => {
    if (!canReorder || hoveredTable == null || hoveredColumnIndex == null) {
      event.preventDefault();
      return;
    }
    columnDragData = {
      columnIndex: hoveredColumnIndex,
      tableKey: getTableKey(hoveredTable),
    };
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData(
        COLUMN_DRAG_MIME_TYPE,
        JSON.stringify(columnDragData),
      );
    }
  };

  const handleColumnDragEnd = () => {
    columnDragData = null;
    dropIndicatorState = null;
  };

  const handleAddColumn = () => {
    const targetCell = hoveredTopCell;
    if (!targetCell) {
      return;
    }
    editor.update(() => {
      const maybeCellNode = getNearestNodeFromDOMNode(targetCell);
      if (isTableCellNode(maybeCellNode)) {
        maybeCellNode.selectEnd();
        insertTableColumnAtSelection();
      }
    });
  };

  const handleAddRow = () => {
    const targetCell = hoveredLeftCell;
    if (!targetCell) {
      return;
    }
    editor.update(() => {
      const maybeCellNode = getNearestNodeFromDOMNode(targetCell);
      if (isTableCellNode(maybeCellNode)) {
        maybeCellNode.selectEnd();
        insertTableRowAtSelection();
      }
    });
  };

  const handleSortColumn = (direction: 'asc' | 'desc') => {
    const targetCell = hoveredTopCell;
    if (!targetCell) {
      return;
    }

    editor.update(() => {
      const cellNode = getNearestNodeFromDOMNode(targetCell);
      if (!isTableCellNode(cellNode)) {
        return;
      }

      const rowNode = cellNode.getParent();
      if (!rowNode || !isTableRowNode(rowNode)) {
        return;
      }

      const tableNode = rowNode.getParent();
      if (!isTableNode(tableNode) || !isSimpleTable(tableNode)) {
        return;
      }

      const colIndex = cellNode.getIndexWithinParent();
      const rows = tableNode.getChildren().filter(isTableRowNode);

      const [tableMap] = computeTableMapSkipCellCheck(
        tableNode,
        cellNode,
        cellNode,
      );

      const headerCell = tableMap[0]?.[colIndex]?.cell;
      const shouldSkipTopRow = headerCell?.hasHeader() ?? false;

      const sortableRows = shouldSkipTopRow ? rows.slice(1) : rows;

      if (sortableRows.length <= 1) {
        return;
      }

      sortableRows.sort((a, b) => {
        const aRowIndex = rows.indexOf(a);
        const bRowIndex = rows.indexOf(b);

        const aMapRow = tableMap[aRowIndex] ?? [];
        const bMapRow = tableMap[bRowIndex] ?? [];

        const aCellValue = aMapRow[colIndex];
        const bCellValue = bMapRow[colIndex];

        const aText = aCellValue?.cell.getTextContent() ?? '';
        const bText = bCellValue?.cell.getTextContent() ?? '';
        const result = aText.localeCompare(bText, undefined, {numeric: true});
        return direction === 'asc' ? -result : result;
      });

      const insertionCaret = shouldSkipTopRow
        ? getSiblingCaret(rows[0], 'next')
        : getChildCaret(tableNode, 'next');

      insertionCaret?.splice(0, sortableRows);
    });
  };
</script>

{#if $isEditable}
  <Portal target={anchorElem}>
    <div
      bind:this={floatingElem}
      style={`position: fixed; ${topStyle} opacity: ${isVisible ? 1 : 0}; pointer-events: ${isVisible ? 'auto' : 'none'};`}
      class="floating-top-actions">
      <button
        class="floating-drag-indicator"
        aria-label="Drag to reorder column"
        type="button"
        draggable={canReorder}
        ondragstart={handleColumnDragStart}
        ondragend={handleColumnDragEnd}>
      </button>
      <DropDown
        buttonAriaLabel="Sort column"
        buttonClassName="floating-filter-indicator"
        hideChevron={true}>
        <DropDownItem class="item" onclick={() => handleSortColumn('desc')}>
          Sort Ascending
        </DropDownItem>
        <DropDownItem class="item" onclick={() => handleSortColumn('asc')}>
          Sort Descending
        </DropDownItem>
      </DropDown>
      <button
        class="floating-add-indicator"
        aria-label="Add column"
        type="button"
        onclick={handleAddColumn}>
      </button>
    </div>
    <button
      bind:this={leftFloatingElem}
      style={`position: fixed; ${leftStyle} opacity: ${isLeftVisible ? 1 : 0}; pointer-events: ${isLeftVisible ? 'auto' : 'none'};`}
      class="floating-add-indicator"
      aria-label="Add row"
      type="button"
      onclick={handleAddRow}>
    </button>
    {#if dropIndicatorState}
      <div
        class="table-column-drop-indicator"
        style={`position: fixed; pointer-events: none; z-index: 20; width: 2px; background-color: #0c66e4; height: ${dropIndicatorState.height}px; top: ${dropIndicatorState.top}px; left: ${dropIndicatorState.left - 1}px;`}>
      </div>
    {/if}
  </Portal>
{/if}
