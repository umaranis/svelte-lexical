<script lang="ts">
  import {getContext} from 'svelte';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    $createParagraphNode as createParagraphNode,
    DEPRECATED_$isGridSelection,
    type LexicalEditor,
  } from 'lexical';
  import {$setBlocksType_experimental as setBlocksType_experimental} from '@lexical/selection';
  import {
    $createHeadingNode as createHeadingNode,
    $createQuoteNode as createQuoteNode,
    type HeadingTagType,
  } from '@lexical/rich-text';
  import {$createCodeNode as createCodeNode} from '@lexical/code';
  import {
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
  } from '@lexical/list';
  import {blockType} from '../editor-state/StateStoreBasic';

  // TODO: convert this component to using DropDown.svelte

  const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
  };

  const editor: LexicalEditor = getContext('editor');
  let button;
  let showBlockOptionsDropDown = false;

  async function showDropdown(event) {
    showBlockOptionsDropDown = !showBlockOptionsDropDown;

    if (showBlockOptionsDropDown && button) {
      const handle = (event) => {
        if (button && !button.contains(event.target)) {
          showBlockOptionsDropDown = false;
          button.removeEventListener('click', handle);
        }
      };
      document.addEventListener('click', handle);
    }
  }

  const formatParagraph = () => {
    if ($blockType !== 'paragraph') {
      editor.update(() => {
        const selection = getSelection();
        if (
          isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        )
          setBlocksType_experimental(selection, () => createParagraphNode());
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if ($blockType !== headingSize) {
      editor.update(() => {
        const selection = getSelection();
        if (
          isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          setBlocksType_experimental(selection, () =>
            createHeadingNode(headingSize),
          );
        }
      });
    }
  };

  const formatBulletList = () => {
    if ($blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if ($blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if ($blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if ($blockType !== 'quote') {
      editor.update(() => {
        const selection = getSelection();
        if (
          isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          setBlocksType_experimental(selection, () => createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if ($blockType !== 'code') {
      editor.update(() => {
        let selection = getSelection();

        if (
          isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            setBlocksType_experimental(selection, () => createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = createCodeNode();
            selection.insertNodes([codeNode]);
            selection = getSelection();
            if (isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };
</script>

<button
  class="toolbar-item block-controls"
  bind:this={button}
  on:click={showDropdown}
  aria-label="Formatting Options">
  <span class={'icon block-type ' + $blockType} />
  <span class="text">{blockTypeToBlockName[$blockType]}</span>
  <i class="chevron-down" />
</button>
{#if showBlockOptionsDropDown}
  <div class="dropdown" style="top: 45px;left:45px">
    <button class="item" on:click={formatParagraph}>
      <span class="icon paragraph" />
      <span class="text">Normal</span>
      {#if $blockType === 'paragraph'}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={() => formatHeading('h1')}>
      <span class="icon h1" />
      <span class="text">Heading 1</span>
      {#if $blockType === 'h1'}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={() => formatHeading('h2')}>
      <span class="icon h2" />
      <span class="text">Heading 2</span>
      {#if $blockType === 'h2'}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={() => formatHeading('h3')}>
      <span class="icon h3" />
      <span class="text">Heading 3</span>
      {#if $blockType === 'h3'}
        <span class="active" />
      {/if}
    </button>

    <button class="item" on:click={formatBulletList}>
      <span class="icon bullet-list" />
      <span class="text">Bullet List</span>
      {#if $blockType === 'bullet'}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={formatNumberedList}>
      <span class="icon numbered-list" />
      <span class="text">Numbered List</span>
      {#if $blockType === 'number'}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={formatCheckList}>
      <span class="icon check-list" />
      <span class="text">Check List</span>
      {#if $blockType === 'check'}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={formatQuote}>
      <span class="icon quote" />
      <span class="text">Quote</span>
      {#if $blockType === 'quote'}
        <span class="active" />
      {/if}
    </button>
    <!--<button class="item" on:click={formatCode}>
      <span class="icon code" />
      <span class="text">Code Block</span>
      {#if $blockType === "code"}
        <span class="active" />
      {/if}
    </button>-->
  </div>
{/if}
