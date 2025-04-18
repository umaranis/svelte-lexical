<script lang="ts">
  import {run} from 'svelte/legacy';

  import {
    $getTableAndElementByKey as getTableAndElementByKey,
    $getTableColumnIndexFromTableCellNode as getTableColumnIndexFromTableCellNode,
    getTableElement,
    $getTableRowIndexFromTableCellNode as getTableRowIndexFromTableCellNode,
    $insertTableColumnAtSelection as insertTableColumnAtSelection,
    $insertTableRowAtSelection as insertTableRowAtSelection,
    $isTableCellNode as isTableCellNode,
    $isTableNode as isTableNode,
    TableCellNode,
    TableNode,
    TableRowNode,
  } from '@lexical/table';
  import {
    $findMatchingParent as findMatchingParent,
    isHTMLElement,
    mergeRegister,
  } from '@lexical/utils';
  import {
    $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
    type NodeKey,
  } from 'lexical';
  import {useDebounce} from '../CodeBlock/CodeActionMenuPlugin/utils.js';
  import {getEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {onDestroy, onMount} from 'svelte';
  import {writable} from 'svelte/store';
  import {CAN_USE_DOM} from '@lexical/utils';
  import {getThemeSelector} from '../util/getThemeSelector.js';

  const BUTTON_WIDTH_PX = 20;

  const editor = getEditor();
  const isEditable = getIsEditable();
  let isShownRow = writable(false);
  let isShownColumn = writable(false);
  let shouldListenMouseMove = $state(false);
  let position = writable('');
  const tableSetRef: Set<NodeKey> = new Set();
  let tableCellDOMNodeRef: HTMLElement | null = null;

  interface Props {
    anchorElem: HTMLElement;
  }

  let {anchorElem}: Props = $props();

  function getMouseInfo(event: MouseEvent): {
    tableDOMNode: HTMLElement | null;
    isOutside: boolean;
  } {
    const target = event.target;

    if (isHTMLElement(target)) {
      const themeSelector = getThemeSelector(editor._config.theme.tableCell);
      const tableDOMNode = target.closest<HTMLElement>(
        `td${themeSelector}, th${themeSelector}`,
      );

      const isOutside = !(
        tableDOMNode ||
        target.closest<HTMLElement>(
          `button${getThemeSelector(editor._config.theme.tableAddRows)}`,
        ) ||
        target.closest<HTMLElement>(
          `button${getThemeSelector(editor._config.theme.tableAddColumns)}`,
        ) ||
        target.closest<HTMLElement>('div.SL_Theme__tableCellResizer')
      );

      return {isOutside, tableDOMNode};
    } else {
      return {isOutside: true, tableDOMNode: null};
    }
  }

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const {isOutside, tableDOMNode} = getMouseInfo(event);

      if (isOutside) {
        $isShownRow = false;
        $isShownColumn = false;
        return;
      }

      if (!tableDOMNode) {
        return;
      }

      tableCellDOMNodeRef = tableDOMNode;

      let hoveredRowNode: TableCellNode | null = null;
      let hoveredColumnNode: TableCellNode | null = null;
      let tableDOMElement: HTMLElement | null = null;

      editor.getEditorState().read(
        () => {
          const maybeTableCell = getNearestNodeFromDOMNode(tableDOMNode);

          if (isTableCellNode(maybeTableCell)) {
            const table = findMatchingParent(maybeTableCell, (node) =>
              isTableNode(node),
            );
            if (!isTableNode(table)) {
              return;
            }

            tableDOMElement = getTableElement(
              table,
              editor.getElementByKey(table.getKey()),
            );

            if (tableDOMElement) {
              const rowCount = table.getChildrenSize();
              const colCount = (
                (table as TableNode).getChildAtIndex(0) as TableRowNode
              )?.getChildrenSize();

              const rowIndex =
                getTableRowIndexFromTableCellNode(maybeTableCell);
              const colIndex =
                getTableColumnIndexFromTableCellNode(maybeTableCell);

              if (rowIndex === rowCount - 1) {
                hoveredRowNode = maybeTableCell;
              } else if (colIndex === colCount - 1) {
                hoveredColumnNode = maybeTableCell;
              }
            }
          }
        },
        {editor},
      );

      if (tableDOMElement) {
        const {
          width: tableElemWidth,
          y: tableElemY,
          right: tableElemRight,
          left: tableElemLeft,
          bottom: tableElemBottom,
          height: tableElemHeight,
        } = (tableDOMElement as HTMLTableElement).getBoundingClientRect();

        // Adjust for using the scrollable table container
        const parentElement = (tableDOMElement as HTMLTableElement)
          .parentElement;
        let tableHasScroll = false;
        if (
          parentElement &&
          parentElement.classList.contains(
            'PlaygroundEditorTheme__tableScrollableWrapper',
          )
        ) {
          tableHasScroll =
            parentElement.scrollWidth > parentElement.clientWidth;
        }

        const {y: editorElemY, left: editorElemLeft} =
          anchorElem.getBoundingClientRect();

        if (hoveredRowNode) {
          $isShownColumn = false;
          $isShownRow = true;
          $position =
            `height: ${BUTTON_WIDTH_PX}px; ` +
            `left: ${tableHasScroll && parentElement ? parentElement.offsetLeft : tableElemLeft - editorElemLeft}px; ` +
            `top: ${tableElemBottom - editorElemY + 5}px; ` +
            `width: ${tableHasScroll && parentElement ? parentElement.offsetWidth : tableElemWidth}px;`;
        } else if (hoveredColumnNode) {
          $isShownColumn = true;
          $isShownRow = false;
          $position =
            `height: ${tableElemHeight}px; ` +
            `left: ${tableElemRight - editorElemLeft + 5}px; ` +
            `top: ${tableElemY - editorElemY}px; ` +
            `width: ${BUTTON_WIDTH_PX}px;`;
        }
      }
    },
    50,
    250,
  );

  run(() => {
    if (CAN_USE_DOM && shouldListenMouseMove) {
      document.addEventListener('mousemove', debouncedOnMouseMove);
    } else if (CAN_USE_DOM) {
      $isShownRow = false;
      $isShownColumn = false;
      debouncedOnMouseMove.cancel();
      document.removeEventListener('mousemove', debouncedOnMouseMove);
    }
  });

  onDestroy(() => {
    $isShownRow = false;
    $isShownColumn = false;
    debouncedOnMouseMove.cancel();
    if (CAN_USE_DOM) {
      document.removeEventListener('mousemove', debouncedOnMouseMove);
    }
  });

  onMount(() => {
    // Hide the buttons on any table dimensions change to prevent last row cells
    // overlap behind the 'Add Row' button when text entry changes cell height
    const tableResizeObserver = new ResizeObserver(() => {
      $isShownRow = false;
      $isShownColumn = false;
    });

    return mergeRegister(
      editor.registerMutationListener(
        TableNode,
        (mutations) => {
          editor.getEditorState().read(
            () => {
              let resetObserver = false;
              for (const [key, type] of mutations) {
                switch (type) {
                  case 'created': {
                    tableSetRef.add(key);
                    resetObserver = true;
                    break;
                  }
                  case 'destroyed': {
                    tableSetRef.delete(key);
                    resetObserver = true;
                    break;
                  }
                  default:
                    break;
                }
              }
              if (resetObserver) {
                // Reset resize observers
                tableResizeObserver.disconnect();
                for (const tableKey of tableSetRef) {
                  const {tableElement} = getTableAndElementByKey(tableKey);
                  tableResizeObserver.observe(tableElement);
                }
                shouldListenMouseMove = tableSetRef.size > 0;
              }
            },
            {editor},
          );
        },
        {skipInitialization: false},
      ),
    );
  });
  const insertAction = (insertRow: boolean) => {
    editor.update(() => {
      if (tableCellDOMNodeRef) {
        const maybeTableNode = getNearestNodeFromDOMNode(tableCellDOMNodeRef);
        maybeTableNode?.selectEnd();
        if (insertRow) {
          insertTableRowAtSelection();
          $isShownRow = false;
        } else {
          insertTableColumnAtSelection();
          $isShownColumn = false;
        }
      }
    });
  };
</script>

{#if $isEditable}
  {#if $isShownRow}
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class={`${editor._config.theme.tableAddRows}`}
      style={$position}
      onclick={() => insertAction(true)}>
    </button>
  {/if}
  {#if $isShownColumn}
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      class={`${editor._config.theme.tableAddColumns}`}
      style={$position}
      onclick={() => insertAction(false)}>
    </button>
  {/if}
{/if}
