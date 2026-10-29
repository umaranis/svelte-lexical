<script lang="ts">
  import {
    $insertTableColumnAtSelection as insertTableColumnAtSelection,
    $insertTableRowAtSelection as insertTableRowAtSelection,
    $isTableCellNode as isTableCellNode,
  } from '@lexical/table';
  import {calculateZoomLevel, CAN_USE_DOM} from '@lexical/utils';
  import {
    $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
    isHTMLElement,
  } from 'lexical';
  import {getEditor, getIsEditable} from '$lib/core/composerContext.js';
  import Portal from '$lib/components/generic/portal/Portal.svelte';
  import {getThemeSelector} from '../util/getThemeSelector.js';

  const INDICATOR_SIZE_PX = 18;
  const SIDE_INDICATOR_SIZE_PX = 18;
  const TOP_BUTTON_OVERHANG = INDICATOR_SIZE_PX / 2;
  const LEFT_BUTTON_OVERHANG = SIDE_INDICATOR_SIZE_PX / 2;
  const SHIFT_PADDING = 8;

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
  let floatingElem: HTMLButtonElement | null = $state(null);
  let leftFloatingElem: HTMLButtonElement | null = $state(null);
  let hoveredTopCell: HTMLTableCellElement | null = null;
  let hoveredLeftCell: HTMLTableCellElement | null = null;

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

  function clamp(value: number, size: number, viewportSize: number): number {
    return Math.max(
      SHIFT_PADDING,
      Math.min(value, viewportSize - size - SHIFT_PADDING),
    );
  }

  // placement top, negative offset so the button overhangs the table's top border, shift with padding
  function getTopStyle(centerX: number, top: number): string {
    const zoom = calculateZoomLevel(anchorElem, true);
    const left = clamp(
      centerX - INDICATOR_SIZE_PX / 2,
      INDICATOR_SIZE_PX,
      window.innerWidth,
    );
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
      if (event.target === floatingElem || event.target === leftFloatingElem) {
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
      } else {
        hoveredTopCell = closestTopCell.cell;
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
</script>

{#if $isEditable}
  <Portal target={anchorElem}>
    <button
      bind:this={floatingElem}
      style={`position: fixed; ${topStyle} opacity: ${isVisible ? 1 : 0}; pointer-events: ${isVisible ? 'auto' : 'none'};`}
      class="floating-add-indicator"
      aria-label="Add column"
      type="button"
      onclick={handleAddColumn}>
    </button>
    <button
      bind:this={leftFloatingElem}
      style={`position: fixed; ${leftStyle} opacity: ${isLeftVisible ? 1 : 0}; pointer-events: ${isLeftVisible ? 'auto' : 'none'};`}
      class="floating-add-indicator"
      aria-label="Add row"
      type="button"
      onclick={handleAddRow}>
    </button>
  </Portal>
{/if}
