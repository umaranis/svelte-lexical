<script lang="ts">
  import {run} from 'svelte/legacy';

  import {
    $getTableNodeFromLexicalNodeOrThrow as getTableNodeFromLexicalNodeOrThrow,
    $getTableCellNodeFromLexicalNode as getTableCellNodeFromLexicalNode,
    getTableElement,
    TableCellNode,
    TableObserver,
    getTableObserverFromTableElement,
    $isTableSelection as isTableSelection,
    $isTableCellNode as isTableCellNode,
  } from '@lexical/table';
  import {
    COMMAND_PRIORITY_CRITICAL,
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    SELECTION_CHANGE_COMMAND,
  } from 'lexical';

  import TableActionMenu from './TableActionMenu.svelte';
  import {writable, type Writable} from 'svelte/store';
  import {getEditor, getIsEditable} from '$lib/core/composerContext.js';
  import {mergeRegister} from '@lexical/utils';

  interface Props {
    anchorElem: HTMLElement;
    cellMerge: boolean;
  }

  let {anchorElem, cellMerge}: Props = $props();

  const editor = getEditor();
  const isEditable = getIsEditable();

  let menuButtonRef: HTMLElement | null = $state(null);
  let menuRootRef: HTMLButtonElement | null = $state(null);
  const isMenuOpen = writable(false);

  const tableCellNode: Writable<TableCellNode | null> = writable(null);

  const moveMenu = () => {
    const menu = menuButtonRef;
    const selection = getSelection();
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;
    function disable() {
      if (menu) {
        menu.classList.remove('table-cell-action-button-container--active');
        menu.classList.add('table-cell-action-button-container--inactive');
      }
      $tableCellNode = null;
    }

    if (selection == null || menu == null) {
      return disable();
    }

    const rootElement = editor.getRootElement();
    let tableObserver: TableObserver | null = null;
    let tableCellParentNodeDOM: HTMLElement | null = null;

    if (
      isRangeSelection(selection) &&
      rootElement !== null &&
      nativeSelection !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const tableCellNodeFromSelection = getTableCellNodeFromLexicalNode(
        selection.anchor.getNode(),
      );

      if (tableCellNodeFromSelection == null) {
        return disable();
      }

      tableCellParentNodeDOM = editor.getElementByKey(
        tableCellNodeFromSelection.getKey(),
      );

      if (
        tableCellParentNodeDOM == null ||
        !tableCellNodeFromSelection.isAttached()
      ) {
        return disable();
      }

      const tableNode = getTableNodeFromLexicalNodeOrThrow(
        tableCellNodeFromSelection,
      );
      const tableElement = getTableElement(
        tableNode,
        editor.getElementByKey(tableNode.getKey()),
      );

      if (!tableElement) {
        throw new Error('Expected to find tableElement in DOM');
      }

      tableObserver = getTableObserverFromTableElement(tableElement);
      $tableCellNode = tableCellNodeFromSelection;
    } else if (isTableSelection(selection)) {
      const anchorNode = getTableCellNodeFromLexicalNode(
        selection.anchor.getNode(),
      );
      if (!isTableCellNode(anchorNode)) {
        throw new Error('TableSelection anchorNode must be a TableCellNode');
      }
      const tableNode = getTableNodeFromLexicalNodeOrThrow(anchorNode);
      const tableElement = getTableElement(
        tableNode,
        editor.getElementByKey(tableNode.getKey()),
      );
      if (!tableElement) {
        throw new Error('Expected to find tableElement in DOM');
      }
      tableObserver = getTableObserverFromTableElement(tableElement);
      tableCellParentNodeDOM = editor.getElementByKey(anchorNode.getKey());
    } else if (!activeElement) {
      return disable();
    }
    if (tableObserver === null || tableCellParentNodeDOM === null) {
      return disable();
    }
    const enabled = !tableObserver || !tableObserver.isSelecting;
    menu.classList.toggle(
      'table-cell-action-button-container--active',
      enabled,
    );
    menu.classList.toggle(
      'table-cell-action-button-container--inactive',
      !enabled,
    );
    if (enabled) {
      const tableCellRect = tableCellParentNodeDOM.getBoundingClientRect();
      const anchorRect = anchorElem.getBoundingClientRect();
      const top = tableCellRect.top - anchorRect.top;
      const left = tableCellRect.right - anchorRect.left;
      menu.style.transform = `translate(${left}px, ${top}px)`;
    }
  };

  $effect(() => {
    // We call the $moveMenu callback every time the selection changes,
    // once up front, and once after each mouseUp
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
    const callback = () => {
      timeoutId = undefined;
      editor.getEditorState().read(moveMenu);
    };
    const delayedCallback = () => {
      if (timeoutId === undefined) {
        timeoutId = setTimeout(callback, 0);
      }
      return false;
    };
    return mergeRegister(
      editor.registerUpdateListener(delayedCallback),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        delayedCallback,
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerRootListener((rootElement, prevRootElement) => {
        if (prevRootElement) {
          prevRootElement.removeEventListener('mouseup', delayedCallback);
        }
        if (rootElement) {
          rootElement.addEventListener('mouseup', delayedCallback);
          delayedCallback();
        }
      }),
      () => clearTimeout(timeoutId),
    );
  });

  let prevTableCellDOM = $state($tableCellNode);

  run(() => {
    if (prevTableCellDOM !== $tableCellNode) {
      $isMenuOpen = false;
    }

    prevTableCellDOM = $tableCellNode;
  });
</script>

{#if $isEditable}
  <div class="table-cell-action-button-container" bind:this={menuButtonRef}>
    {#if $tableCellNode != null}
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button
        type="button"
        class="table-cell-action-button chevron-down"
        onclick={(e) => {
          e.stopPropagation();
          $isMenuOpen = !$isMenuOpen;
        }}
        bind:this={menuRootRef}>
        <i class="chevron-down"></i>
      </button>
      {#if $isMenuOpen}
        <TableActionMenu
          contextRef={menuRootRef}
          setIsMenuOpen={(val) => ($isMenuOpen = val)}
          onClose={() => ($isMenuOpen = false)}
          _tableCellNode={$tableCellNode}
          {cellMerge} />
      {/if}
    {/if}
  </div>
{/if}
