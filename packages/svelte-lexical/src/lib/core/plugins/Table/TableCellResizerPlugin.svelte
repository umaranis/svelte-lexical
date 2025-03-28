<script lang="ts">
  import type {TableCellNode, TableDOMCell, TableMapType} from '@lexical/table';
  import type {LexicalEditor, NodeKey} from 'lexical';

  import {
    $computeTableMapSkipCellCheck as computeTableMapSkipCellCheck,
    $getTableNodeFromLexicalNodeOrThrow as getTableNodeFromLexicalNodeOrThrow,
    $getTableRowIndexFromTableCellNode as getTableRowIndexFromTableCellNode,
    $isTableCellNode as isTableCellNode,
    $isTableRowNode as isTableRowNode,
    getDOMCellFromTarget,
    getTableElement,
    TableNode,
  } from '@lexical/table';
  import {calculateZoomLevel, mergeRegister} from '@lexical/utils';
  import {
    $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
    isHTMLElement,
  } from 'lexical';

  import type {CSSProperties} from '$lib/types.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import Portal from '$lib/components/generic/portal/Portal.svelte';
  import {cssStylesToString} from '../util/cssStylesUtil.js';

  type PointerPosition = {
    x: number;
    y: number;
  };

  type PointerDraggingDirection = 'right' | 'bottom';

  const MIN_ROW_HEIGHT = 33;
  const MIN_COLUMN_WIDTH = 92;

  let editor = getEditor();

  let targetRef: HTMLElement | null = null;
  let resizerRef: HTMLDivElement | null = null;
  let tableRectRef: DOMRect | null = null;
  let hasTable = $state(false);

  let pointerStartPosRef: PointerPosition | null = null;
  let pointerCurrentPos = $state<PointerPosition | null>(null);

  let activeCell = $state<TableDOMCell | null>(null);
  let draggingDirection = $state<PointerDraggingDirection | null>(null);

  const resetState = () => {
    activeCell = null;
    targetRef = null;
    draggingDirection = null;
    pointerStartPosRef = null;
    tableRectRef = null;
  };

  $effect(() => {
    const tableKeys = new Set<NodeKey>();
    return mergeRegister(
      editor.registerMutationListener(TableNode, (nodeMutations) => {
        for (const [nodeKey, mutation] of nodeMutations) {
          if (mutation === 'destroyed') {
            tableKeys.delete(nodeKey);
          } else {
            tableKeys.add(nodeKey);
          }
        }
        hasTable = tableKeys.size > 0;
      }),
      editor.registerNodeTransform(TableNode, (tableNode) => {
        if (tableNode.getColWidths()) {
          return tableNode;
        }

        const numColumns = tableNode.getColumnCount();
        const columnWidth = MIN_COLUMN_WIDTH;

        tableNode.setColWidths(Array(numColumns).fill(columnWidth));
        return tableNode;
      }),
    );
  });

  $effect(() => {
    if (!hasTable) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target;
      if (!isHTMLElement(target)) {
        return;
      }

      if (draggingDirection) {
        event.preventDefault();
        event.stopPropagation();
        pointerCurrentPos = {
          x: event.clientX,
          y: event.clientY,
        };
        return;
      }
      if (resizerRef && resizerRef.contains(target)) {
        return;
      }

      if (targetRef !== target) {
        targetRef = target;
        const cell = getDOMCellFromTarget(target);

        if (cell && activeCell !== cell) {
          editor.getEditorState().read(
            () => {
              const tableCellNode = getNearestNodeFromDOMNode(cell.elem);
              if (!tableCellNode) {
                throw new Error('TableCellResizer: Table cell node not found.');
              }

              const tableNode =
                getTableNodeFromLexicalNodeOrThrow(tableCellNode);
              const tableElement = getTableElement(
                tableNode,
                editor.getElementByKey(tableNode.getKey()),
              );

              if (!tableElement) {
                throw new Error('TableCellResizer: Table element not found.');
              }

              targetRef = target as HTMLElement;
              tableRectRef = tableElement.getBoundingClientRect();
              activeCell = cell;
            },
            {editor},
          );
        } else if (cell == null) {
          resetState();
        }
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const isTouchEvent = event.pointerType === 'touch';
      if (isTouchEvent) {
        onPointerMove(event);
      }
    };

    const resizerContainer = resizerRef;
    resizerContainer?.addEventListener('pointermove', onPointerMove, {
      capture: true,
    });

    const removeRootListener = editor.registerRootListener(
      (rootElement, prevRootElement) => {
        prevRootElement?.removeEventListener('pointermove', onPointerMove);
        prevRootElement?.removeEventListener('pointerdown', onPointerDown);
        rootElement?.addEventListener('pointermove', onPointerMove);
        rootElement?.addEventListener('pointerdown', onPointerDown);
      },
    );

    return () => {
      removeRootListener();
      resizerContainer?.removeEventListener('pointermove', onPointerMove);
    };
  });

  const isHeightChanging = (direction: PointerDraggingDirection) => {
    if (direction === 'bottom') {
      return true;
    }
    return false;
  };

  const updateRowHeight = (heightChange: number) => {
    editor.update(
      () => {
        if (!activeCell) {
          throw new Error('TableCellResizer: Expected active cell.');
        }
        const tableCellNode = getNearestNodeFromDOMNode(activeCell.elem);
        if (!isTableCellNode(tableCellNode)) {
          throw new Error('TableCellResizer: Table cell node not found.');
        }

        const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        const baseRowIndex = getTableRowIndexFromTableCellNode(tableCellNode);
        const tableRows = tableNode.getChildren();

        // Determine if this is a full row merge by checking colspan
        const isFullRowMerge =
          tableCellNode.getColSpan() === tableNode.getColumnCount();

        // For full row merges, apply to first row. For partial merges, apply to last row
        const tableRowIndex = isFullRowMerge
          ? baseRowIndex
          : baseRowIndex + tableCellNode.getRowSpan() - 1;

        if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
          throw new Error('Expected table cell to be inside of table row.');
        }

        const tableRow = tableRows[tableRowIndex];

        if (!isTableRowNode(tableRow)) {
          throw new Error('Expected table row');
        }

        let height = tableRow.getHeight();
        if (height === undefined) {
          const rowCells = tableRow.getChildren<TableCellNode>();
          height = Math.min(
            ...rowCells.map(
              (cell) => getCellNodeHeight(cell, editor) ?? Infinity,
            ),
          );
        }

        const newHeight = Math.max(height + heightChange, MIN_ROW_HEIGHT);
        tableRow.setHeight(newHeight);
      },
      {tag: 'skip-scroll-into-view'},
    );
  };

  const getCellNodeHeight = (
    cell: TableCellNode,
    activeEditor: LexicalEditor,
  ): number | undefined => {
    const domCellNode = activeEditor.getElementByKey(cell.getKey());
    return domCellNode?.clientHeight;
  };

  const getCellColumnIndex = (
    tableCellNode: TableCellNode,
    tableMap: TableMapType,
  ) => {
    for (let row = 0; row < tableMap.length; row++) {
      for (let column = 0; column < tableMap[row].length; column++) {
        if (tableMap[row][column].cell === tableCellNode) {
          return column;
        }
      }
    }
  };

  const updateColumnWidth = (widthChange: number) => {
    editor.update(
      () => {
        if (!activeCell) {
          throw new Error('TableCellResizer: Expected active cell.');
        }
        const tableCellNode = getNearestNodeFromDOMNode(activeCell.elem);
        if (!isTableCellNode(tableCellNode)) {
          throw new Error('TableCellResizer: Table cell node not found.');
        }

        const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        const [tableMap] = computeTableMapSkipCellCheck(tableNode, null, null);
        const columnIndex = getCellColumnIndex(tableCellNode, tableMap);
        if (columnIndex === undefined) {
          throw new Error('TableCellResizer: Table column not found.');
        }

        const colWidths = tableNode.getColWidths();
        if (!colWidths) {
          return;
        }
        const width = colWidths[columnIndex];
        if (width === undefined) {
          return;
        }
        const newColWidths = [...colWidths];
        const newWidth = Math.max(width + widthChange, MIN_COLUMN_WIDTH);
        newColWidths[columnIndex] = newWidth;
        tableNode.setColWidths(newColWidths);
      },
      {tag: 'skip-scroll-into-view'},
    );
  };

  const pointerUpHandler = (direction: PointerDraggingDirection) => {
    const handler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!activeCell) {
        throw new Error('TableCellResizer: Expected active cell.');
      }

      if (pointerStartPosRef) {
        const {x, y} = pointerStartPosRef;

        if (activeCell === null) {
          return;
        }
        const zoom = calculateZoomLevel(event.target as Element);

        if (isHeightChanging(direction)) {
          const heightChange = (event.clientY - y) / zoom;
          updateRowHeight(heightChange);
        } else {
          const widthChange = (event.clientX - x) / zoom;
          updateColumnWidth(widthChange);
        }

        resetState();
        document.removeEventListener('pointerup', handler);
      }
    };
    return handler;
  };

  const toggleResize =
    (direction: PointerDraggingDirection) => (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!activeCell) {
        throw new Error('TableCellResizer: Expected active cell.');
      }

      pointerStartPosRef = {
        x: event.clientX,
        y: event.clientY,
      };
      pointerCurrentPos = pointerStartPosRef;
      draggingDirection = direction;

      document.addEventListener('pointerup', pointerUpHandler(direction));
    };

  const getResizers = () => {
    if (activeCell) {
      const {height, width, top, left} =
        activeCell.elem.getBoundingClientRect();
      const zoom = calculateZoomLevel(activeCell.elem);
      const zoneWidth = 16; // Pixel width of the zone where you can drag the edge
      const styles: Record<string, CSSProperties> = {
        bottom: {
          'background-color': 'none',
          cursor: 'row-resize',
          height: `${zoneWidth}px`,
          left: `${window.scrollX + left}px`,
          top: `${window.scrollY + top + height - zoneWidth / 2}px`,
          width: `${width}px`,
        },
        right: {
          'background-color': 'none',
          cursor: 'col-resize',
          height: `${height}px`,
          left: `${window.scrollX + left + width - zoneWidth / 2}px`,
          top: `${window.scrollY + top}px`,
          width: `${zoneWidth}px`,
        },
      };

      const tableRect = tableRectRef;

      if (draggingDirection && pointerCurrentPos && tableRect) {
        if (isHeightChanging(draggingDirection)) {
          styles[draggingDirection].left = `${
            window.scrollX + tableRect.left
          }px`;
          styles[draggingDirection].top = `${
            window.scrollY + pointerCurrentPos.y / zoom
          }px`;
          styles[draggingDirection].height = '3px';
          styles[draggingDirection].width = `${tableRect.width}px`;
        } else {
          styles[draggingDirection].top = `${window.scrollY + tableRect.top}px`;
          styles[draggingDirection].left = `${
            window.scrollX + pointerCurrentPos.x / zoom
          }px`;
          styles[draggingDirection].width = '3px';
          styles[draggingDirection].height = `${tableRect.height}px`;
        }

        styles[draggingDirection]['background-color'] = '#adf';
        styles[draggingDirection]['mix-blend-mode'] = 'unset';
      }
      return styles;
    }

    return {
      bottom: null,
      left: null,
      right: null,
      top: null,
    };
  };

  let resizerStyles = $derived.by(() => {
    if (activeCell) {
      return getResizers();
    } else {
      return {
        bottom: null,
        left: null,
        right: null,
        top: null,
      };
    }
  });
</script>

<Portal>
  <div bind:this={resizerRef}>
    {#if activeCell != null}
      <div
        class="SL_Theme__tableCellResizer"
        style={resizerStyles.right
          ? cssStylesToString(resizerStyles.right)
          : undefined}
        onpointerdown={toggleResize('right')}>
      </div>
      <div
        class="SL_Theme__tableCellResizer"
        style={resizerStyles.bottom
          ? cssStylesToString(resizerStyles.bottom)
          : undefined}
        onpointerdown={toggleResize('bottom')}>
      </div>
    {/if}
  </div>
</Portal>

<style>
  .SL_Theme__tableCellResizer {
    position: absolute;
    touch-action: none;
  }

  @media (pointer: coarse) {
    .SL_Theme__tableCellResizer {
      background-color: #adf;
      mix-blend-mode: color;
    }
  }
</style>
