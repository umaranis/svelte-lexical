<script lang="ts">
  import Portal from '$lib/components/generic/portal/Portal.svelte';
  import {getEditor} from '$lib/core/composerContext.js';
  import {
    getDOMCellFromTarget,
    TableNode,
    getTableElement,
    TableCellNode,
    $getTableRowIndexFromTableCellNode as getTableRowIndexFromTableCellNode,
    $getTableNodeFromLexicalNodeOrThrow as getTableNodeFromLexicalNodeOrThrow,
    $computeTableMapSkipCellCheck as computeTableMapSkipCellCheck,
    $isTableCellNode as isTableCellNode,
    $isTableRowNode as isTableRowNode,
    type TableDOMCell,
    type TableMapType,
  } from '@lexical/table';
  import {
    calculateZoomLevel,
    isHTMLElement,
    mergeRegister,
  } from '@lexical/utils';
  import {
    $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
    type LexicalEditor,
  } from 'lexical';
  import {onDestroy, onMount} from 'svelte';
  import {CAN_USE_DOM} from '$lib/environment/canUseDOM.js';

  type MouseDraggingDirection = 'horizontal' | 'vertical';

  type MousePosition = {
    x: number;
    y: number;
  };

  const MIN_ROW_HEIGHT = 33;
  const MIN_COLUMN_WIDTH = 92;

  let hasTable = $state(false);
  let activeCell: TableDOMCell | null = $state.raw(null);
  let tableRect: DOMRect | null = $state(null);
  let mouseStartPos: MousePosition | null = $state(null);
  let mouseCurrentPos: MousePosition | null = $state(null);
  let draggingDirection: MouseDraggingDirection | null = $state(null);
  let resizerRef: HTMLDivElement | undefined = $state(undefined);
  let targetRef: HTMLElement | null = $state(null);
  let cellRectBeforeDrag: DOMRect | null = $state(null);
  let dragOffset = $state(0);

  const editor = getEditor();

  onMount(() => {
    const tableKeys = new Set<string>();

    return mergeRegister(
      editor.registerMutationListener(TableNode, (nodeMutations) => {
        for (const [nodeKey, mutation] of nodeMutations) {
          if (mutation === 'destroyed') {
            tableKeys.delete(nodeKey);
          } else {
            tableKeys.add(nodeKey);
          }
          hasTable = tableKeys.size > 0;
        }
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

  onDestroy(() => {
    removeRootListener();
  });

  const onPointerUp = (e: PointerEvent) => {};
  const onPointerDown = (e: PointerEvent) => {};

  const onPointerMove = (e: PointerEvent) => {
    const target = e.target as HTMLElement;

    if (!isHTMLElement(target)) {
      return;
    }

    if (draggingDirection) {
      mouseCurrentPos = {
        x: e.clientX,
        y: e.clientY,
      };

      return;
    }

    if (resizerRef && resizerRef.contains(target)) {
      return;
    }

    if (targetRef !== target) {
      targetRef = target;
      const cell = getDOMCellFromTarget(target);

      if (cell && cell !== activeCell) {
        editor.getEditorState().read(
          () => {
            const tableCellNode = getNearestNodeFromDOMNode(cell.elem);

            if (!tableCellNode) {
              throw new Error(
                'TableCellResizePlugin: Table cell node not found',
              );
            }

            const tableNode = getTableNodeFromLexicalNodeOrThrow(tableCellNode);
            const tableElement = getTableElement(
              tableNode,
              editor.getElementByKey(tableNode.getKey()),
            );

            if (!tableElement) {
              throw new Error(
                'TableCellResizePlugin: Table element node not found',
              );
            }

            targetRef = target;
            tableRect = tableElement.getBoundingClientRect();
            activeCell = cell;
          },
          {editor},
        );
      } else if (cell == null) {
        resetState();
      }
    }
  };

  const removeRootListener = editor.registerRootListener(
    (rootElement, prevRootElement) => {
      prevRootElement?.removeEventListener('pointermove', onPointerMove);
      prevRootElement?.removeEventListener('pointerdown', onPointerDown);
      prevRootElement?.removeEventListener('pointerup', onPointerUp);
      rootElement?.addEventListener('pointermove', onPointerMove);
      rootElement?.addEventListener('pointerdown', onPointerDown);
      rootElement?.addEventListener('pointerup', onPointerUp);
    },
  );

  const updateRowHeight = (updatedHeight: number) => {
    if (!tableRow) {
      throw new Error('TableCellResizer: Failed updating height.');
    }

    const newHeight = Math.max(updatedHeight, MIN_ROW_HEIGHT);
    tableRow.setHeight(newHeight);
  };

  const cellLexicalNode = $derived.by(() => {
    if (activeCell) {
      const node = getNearestNodeFromDOMNode(activeCell.elem);

      if (!isTableCellNode(node)) {
        throw new Error('TableCellResizer: Table cell node not found.');
      }

      return node;
    }

    return null;
  });

  const tableNode = $derived.by(() => {
    if (cellLexicalNode) {
      return getTableNodeFromLexicalNodeOrThrow(cellLexicalNode);
    }

    return null;
  });

  const tableRowIndex = $derived.by(() => {
    if (tableNode && cellLexicalNode) {
      return (
        getTableRowIndexFromTableCellNode(cellLexicalNode) +
        cellLexicalNode.getRowSpan() -
        1
      );
    }

    return null;
  });

  const tableRow = $derived.by(() => {
    if (tableNode && tableRowIndex !== null) {
      const tableRows = tableNode.getChildren();

      if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
        throw new Error('Expected table cell to be inside of table row.');
      }

      const row = tableRows[tableRowIndex];

      if (!isTableRowNode(row)) {
        throw new Error('Expected table row');
      }

      return row;
    }

    return null;
  });

  const tableColumnIndex = $derived.by(() => {
    if (!tableNode || !cellLexicalNode) return null;

    const [tableMap] = computeTableMapSkipCellCheck(tableNode, null, null);
    const columnIndex = getCellColumnIndex(cellLexicalNode, tableMap);

    if (columnIndex === undefined) {
      throw new Error('TableCellResizer: Table column not found.');
    }

    return columnIndex;
  });

  const getRowHeight = () => {
    if (!activeCell || tableRowIndex === null || !tableNode || !tableRow) {
      throw new Error(
        'TableCellResizer: Expected active cell, table and row for computing height of the row.',
      );
    }

    let height = tableRow.getHeight();
    if (height === undefined) {
      const rowCells = tableRow.getChildren<TableCellNode>();
      height = Math.min(
        ...rowCells.map((cell) => getCellNodeHeight(cell, editor) ?? Infinity),
      );
    }

    return height;
  };

  const getRowWidths = () => {
    if (!tableNode || tableColumnIndex === null) {
      throw new Error(
        'TableCellResizer: Expected table and column index for computing width of the row.',
      );
    }

    const colWidths = tableNode.getColWidths();
    if (!colWidths) {
      throw new Error('TableCellResizer: Column widths not found.');
    }

    const currentCellWidth = colWidths[tableColumnIndex];

    if (currentCellWidth === undefined) {
      throw new Error('TableCellResizer: Column width not found.');
    }

    return {currentCellWidth, colWidths};
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

  const updateColumnWidth = (updatedWidth: number) => {
    if (!tableNode || tableColumnIndex === null) {
      throw new Error('TableCellResizer: Failed updating width.');
    }

    const {colWidths} = getRowWidths();
    const newColWidths = [...colWidths];
    const newWidth = Math.max(updatedWidth, MIN_COLUMN_WIDTH);
    newColWidths[tableColumnIndex] = newWidth;
    tableNode.setColWidths(newColWidths);
  };

  const resizePointerUpHandler = (moveHandler: (e: PointerEvent) => void) => {
    const handler = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      resetState();
      document.removeEventListener('pointerup', handler);
      document.removeEventListener('pointermove', moveHandler);
    };

    return handler;
  };

  const resizePointerMoveHandler = (direction: MouseDraggingDirection) => {
    const handler = (event: PointerEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (mouseStartPos) {
        const {x, y} = mouseStartPos;

        if (activeCell === null || cellLexicalNode === null) {
          return;
        }

        const zoom = calculateZoomLevel(event.target as Element);
        editor.update(
          () => {
            if (!cellRectBeforeDrag) return;

            if (direction === 'vertical') {
              const heightChange = (event.clientY - y) / zoom;
              dragOffset = heightChange;
              updateRowHeight(cellRectBeforeDrag.height + heightChange);
            }

            if (direction === 'horizontal') {
              const widthChange = (event.clientX - x) / zoom;
              dragOffset = widthChange;
              updateColumnWidth(cellRectBeforeDrag.width + widthChange);
            }
          },
          {tag: 'skip-scroll-into-view'},
        );
      }
    };

    return handler;
  };

  function toggleResizeDirection(
    event: PointerEvent,
    direction: MouseDraggingDirection,
  ) {
    if (!isPointerEvent(event)) return;

    event.preventDefault();
    event.stopPropagation();

    if (!activeCell) {
      throw new Error('TableCellResize: Expected active cell.');
    }

    mouseStartPos = {
      x: event.clientX,
      y: event.clientY,
    };

    mouseCurrentPos = mouseStartPos;
    draggingDirection = direction;

    editor.read(() => {
      const domCellNode = editor.getElementByKey(cellLexicalNode!.getKey());
      cellRectBeforeDrag = domCellNode?.getBoundingClientRect() || null;
    });

    const moveHandler = resizePointerMoveHandler(direction);

    document.addEventListener('pointerup', resizePointerUpHandler(moveHandler));
    document.addEventListener('pointermove', moveHandler);
  }

  const resizerStyles: Record<MouseDraggingDirection, string> = $derived.by(
    () => {
      if (activeCell) {
        const zoom = calculateZoomLevel(activeCell.elem);
        const {left, top, bottom, width, height} =
          activeCell.elem.getBoundingClientRect();
        const RESIZER_THRESHOLD = 10;
        const RESIZER_SIZE = 4;
        const RESIZER_COLOR = '#219ebc6a';

        let styles = {
          horizontal: `
            background-color: none;
            cursor: col-resize;
            height: ${height}px;
            left: ${window.scrollX + left + width - RESIZER_THRESHOLD / 2}px;
            top: ${window.scrollY + top}px;
            width: ${RESIZER_THRESHOLD}px;
          `,
          vertical: `
            background-color: none;
            cursor: row-resize;
            height: ${RESIZER_THRESHOLD}px;
            left: ${window.scrollX + left}px;
            top: ${window.scrollY + top + height - RESIZER_THRESHOLD / 2}px;
            width: ${width}px;
          `,
        };

        if (
          draggingDirection &&
          mouseCurrentPos &&
          tableRect &&
          cellRectBeforeDrag
        ) {
          if (draggingDirection === 'horizontal') {
            styles.horizontal = `
              background-color: ${RESIZER_COLOR};
              cursor: col-resize;
              height: ${tableRect.height}px;
              left: ${(window.scrollX + cellRectBeforeDrag.right + dragOffset - RESIZER_SIZE / 2) / zoom}px;
              top: ${window.scrollY + tableRect.top}px;
              width: ${RESIZER_SIZE}px;
            `;
          }

          if (draggingDirection === 'vertical') {
            styles.vertical = `
              background-color: ${RESIZER_COLOR};
              cursor: row-resize;
              height: ${RESIZER_SIZE}px;
              left: ${window.scrollX + tableRect.left}px;
              top: ${(window.scrollY + cellRectBeforeDrag.bottom + dragOffset - RESIZER_SIZE / 2) / zoom}px;
              width: ${tableRect.width}px;
            `;
          }
        }
        return styles;
      }

      return {vertical: '', horizontal: ''};
    },
  );

  function resetState() {
    targetRef = null;
    activeCell = null;
    tableRect = null;
    mouseStartPos = null;
    draggingDirection = null;
    cellRectBeforeDrag = null;
    dragOffset = 0;
  }

  const isPointerEvent = (e: PointerEvent) => {
    if (e.pointerType === 'mouse' && e.buttons === 1) {
      return true;
    }

    if (e.pointerType === 'touch') {
      return true;
    }

    return false;
  };
</script>

{#if CAN_USE_DOM && activeCell}
  <Portal bind:portalRef={resizerRef} target={document.body}>
    <div
      class="SL_Theme__tableCellResizer"
      style={resizerStyles.horizontal}
      onpointerdown={(e) => toggleResizeDirection(e, 'horizontal')}>
    </div>
    <div
      class="SL_Theme__tableCellResizer"
      style={resizerStyles.vertical}
      onpointerdown={(e) => toggleResizeDirection(e, 'vertical')}>
    </div>
  </Portal>
{/if}

<style>
  .SL_Theme__tableCellResizer {
    position: absolute;
  }
</style>
