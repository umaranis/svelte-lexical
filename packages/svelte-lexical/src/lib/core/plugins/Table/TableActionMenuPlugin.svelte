<script lang="ts">
  import {run} from 'svelte/legacy';

  import {
    $getTableCellNodeFromLexicalNode as getTableCellNodeFromLexicalNode,
    TableCellNode,
  } from '@lexical/table';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';

  import {onMount} from 'svelte';
  import TableActionMenu from './TableActionMenu.svelte';
  import {writable, type Writable} from 'svelte/store';
  import {getEditor, getIsEditable} from '$lib/core/composerContext.js';

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

    if (selection == null || menu == null) {
      $tableCellNode = null;
      return;
    }

    const rootElement = editor.getRootElement();

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
        $tableCellNode = null;
        return;
      }

      const tableCellParentNodeDOM = editor.getElementByKey(
        tableCellNodeFromSelection.getKey(),
      );

      if (tableCellParentNodeDOM == null) {
        $tableCellNode = null;
        return;
      }

      $tableCellNode = tableCellNodeFromSelection;
    } else if (!activeElement) {
      $tableCellNode = null;
    }
  };

  onMount(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        moveMenu();
      });
    });
  });

  run(() => {
    const menuButtonDOM = menuButtonRef as HTMLButtonElement | null;

    if (menuButtonDOM != null && $tableCellNode != null) {
      const tableCellNodeDOM = editor.getElementByKey($tableCellNode.getKey());

      if (tableCellNodeDOM != null) {
        const tableCellRect = tableCellNodeDOM.getBoundingClientRect();
        const menuRect = menuButtonDOM.getBoundingClientRect();
        const anchorRect = anchorElem.getBoundingClientRect();

        const top = tableCellRect.top - anchorRect.top + 4;
        const left =
          tableCellRect.right - menuRect.width - 10 - anchorRect.left;

        menuButtonDOM.style.opacity = '1';
        menuButtonDOM.style.transform = `translate(${left}px, ${top}px)`;
      } else {
        menuButtonDOM.style.opacity = '0';
        menuButtonDOM.style.transform = 'translate(-10000px, -10000px)';
      }
    }
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
