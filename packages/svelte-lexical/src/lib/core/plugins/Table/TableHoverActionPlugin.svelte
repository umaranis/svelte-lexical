<script lang="ts">
  import {run} from 'svelte/legacy';

  import {
    $getTableColumnIndexFromTableCellNode as getTableColumnIndexFromTableCellNode,
    $getTableRowIndexFromTableCellNode as getTableRowIndexFromTableCellNode,
    $insertTableColumn__EXPERIMENTAL as insertTableColumn__EXPERIMENTAL,
    $insertTableRow__EXPERIMENTAL as insertTableRow__EXPERIMENTAL,
    $isTableCellNode as isTableCellNode,
    $isTableNode as isTableNode,
    TableCellNode,
    TableNode,
    TableRowNode,
  } from '@lexical/table';
  import {
    $findMatchingParent as findMatchingParent,
    mergeRegister,
  } from '@lexical/utils';
  import {
    $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
    type NodeKey,
  } from 'lexical';
  import {useDebounce} from '../CodeBlock/CodeActionMenuPlugin/utils.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import {onDestroy, onMount} from 'svelte';
  import {writable} from 'svelte/store';
  import {CAN_USE_DOM} from '$lib/environment/canUseDOM.js';

  const BUTTON_WIDTH_PX = 20;

  const editor = getEditor();
  let isShownRow = writable(false);
  let isShownColumn = writable(false);
  let shouldListenMouseMove = $state(false);
  let position = writable('');
  const codeSetRef: Set<NodeKey> = new Set();
  let tableDOMNodeRef: HTMLElement | null = null;

  interface Props {
    anchorElem: HTMLElement;
  }

  let {anchorElem}: Props = $props();

  function getMouseInfo(event: MouseEvent): {
    tableDOMNode: HTMLElement | null;
    isOutside: boolean;
  } {
    const target = event.target;

    if (target && target instanceof HTMLElement) {
      const tableDOMNode = target.closest<HTMLElement>(
        'td.PlaygroundEditorTheme__tableCell, th.PlaygroundEditorTheme__tableCell',
      );

      const isOutside = !(
        tableDOMNode ||
        target.closest<HTMLElement>(
          'button.PlaygroundEditorTheme__tableAddRows',
        ) ||
        target.closest<HTMLElement>(
          'button.PlaygroundEditorTheme__tableAddColumns',
        ) ||
        target.closest<HTMLElement>('div.TableCellResizer__resizer')
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

      tableDOMNodeRef = tableDOMNode;

      let hoveredRowNode: TableCellNode | null = null;
      let hoveredColumnNode: TableCellNode | null = null;
      let tableDOMElement: HTMLElement | null = null;

      editor.update(() => {
        const maybeTableCell = getNearestNodeFromDOMNode(tableDOMNode);

        if (isTableCellNode(maybeTableCell)) {
          const table = findMatchingParent(maybeTableCell, (node) =>
            isTableNode(node),
          );
          if (!isTableNode(table)) {
            return;
          }

          tableDOMElement = editor.getElementByKey(table?.getKey());

          if (tableDOMElement) {
            const rowCount = table.getChildrenSize();
            const colCount = (
              (table as TableNode).getChildAtIndex(0) as TableRowNode
            )?.getChildrenSize();

            const rowIndex = getTableRowIndexFromTableCellNode(maybeTableCell);
            const colIndex =
              getTableColumnIndexFromTableCellNode(maybeTableCell);

            if (rowIndex === rowCount - 1) {
              hoveredRowNode = maybeTableCell;
            } else if (colIndex === colCount - 1) {
              hoveredColumnNode = maybeTableCell;
            }
          }
        }
      });

      if (tableDOMElement) {
        const {
          width: tableElemWidth,
          y: tableElemY,
          x: tableElemX,
          right: tableElemRight,
          bottom: tableElemBottom,
          height: tableElemHeight,
        } = (tableDOMElement as HTMLTableElement).getBoundingClientRect();

        const {x: editorElemX, y: editorElemY} =
          anchorElem.getBoundingClientRect();

        if (hoveredRowNode) {
          $isShownColumn = false;
          $isShownRow = true;
          $position = `height: ${BUTTON_WIDTH_PX}px; left: ${tableElemX - editorElemX}px; top: ${tableElemBottom - editorElemY + 5}px; width: ${tableElemWidth}px;`;
        } else if (hoveredColumnNode) {
          $isShownColumn = true;
          $isShownRow = false;
          $position = `height: ${tableElemHeight}px; left: ${tableElemRight - editorElemX + 5}px; top: ${tableElemY - editorElemY}px; width: ${BUTTON_WIDTH_PX}px;`;
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
    return mergeRegister(
      editor.registerMutationListener(
        TableNode,
        (mutations) => {
          editor.getEditorState().read(() => {
            for (const [key, type] of mutations) {
              switch (type) {
                case 'created':
                  codeSetRef.add(key);
                  shouldListenMouseMove = codeSetRef.size > 0;
                  break;

                case 'destroyed':
                  codeSetRef.delete(key);
                  shouldListenMouseMove = codeSetRef.size > 0;
                  break;

                default:
                  break;
              }
            }
          });
        },
        {skipInitialization: false},
      ),
    );
  });
  const insertAction = (insertRow: boolean) => {
    editor.update(() => {
      if (tableDOMNodeRef) {
        const maybeTableNode = getNearestNodeFromDOMNode(tableDOMNodeRef);
        maybeTableNode?.selectEnd();
        if (insertRow) {
          insertTableRow__EXPERIMENTAL();
          $isShownRow = false;
        } else {
          insertTableColumn__EXPERIMENTAL();
          $isShownColumn = false;
        }
      }
    });
  };
</script>

{#if $isShownRow}
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button
    class={'PlaygroundEditorTheme__tableAddRows'}
    style={$position}
    onclick={() => insertAction(true)}>
  </button>
{/if}
{#if $isShownColumn}
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button
    class={'PlaygroundEditorTheme__tableAddColumns'}
    style={$position}
    onclick={() => insertAction(false)}>
  </button>
{/if}
