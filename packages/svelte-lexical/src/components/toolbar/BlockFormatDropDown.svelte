<script lang="ts">
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
  // import {$createCodeNode as createCodeNode} from '@lexical/code';
  import {
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
  } from '@lexical/list';
  import {getEditor} from '../../core/svelteContext';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import DropDown from '../generic/dropdown/DropDown.svelte';
  import DropDownItem from '../generic/dropdown/DropDownItem.svelte';

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

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor: LexicalEditor = getEditor();
  export let disabled: boolean;

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

  // const formatCode = () => {
  //   if ($blockType !== 'code') {
  //     editor.update(() => {
  //       let selection = getSelection();

  //       if (
  //         isRangeSelection(selection) ||
  //         DEPRECATED_$isGridSelection(selection)
  //       ) {
  //         if (selection.isCollapsed()) {
  //           setBlocksType_experimental(selection, () => createCodeNode());
  //         } else {
  //           const textContent = selection.getTextContent();
  //           const codeNode = createCodeNode();
  //           selection.insertNodes([codeNode]);
  //           selection = getSelection();
  //           if (isRangeSelection(selection))
  //             selection.insertRawText(textContent);
  //         }
  //       }
  //     });
  //   }
  // };

  function dropDownActiveClass(active: boolean) {
    if (active) return 'active dropdown-item-active';
    else return '';
  }
</script>

<DropDown
  {disabled}
  buttonClassName="toolbar-item block-controls"
  buttonIconClassName={'icon block-type ' + $blockType}
  buttonLabel={blockTypeToBlockName[$blockType]}
  buttonAriaLabel="Formatting options for text style">
  <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'paragraph')}
    on:click={formatParagraph}>
    <i class="icon paragraph" />
    <span class="text">Normal</span>
  </DropDownItem>
  <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'h1')}
    on:click={() => formatHeading('h1')}>
    <i class="icon h1" />
    <span class="text">Heading 1</span>
  </DropDownItem>
  <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'h2')}
    on:click={() => formatHeading('h2')}>
    <i class="icon h2" />
    <span class="text">Heading 2</span>
  </DropDownItem>
  <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'h3')}
    on:click={() => formatHeading('h3')}>
    <i class="icon h3" />
    <span class="text">Heading 3</span>
  </DropDownItem>
  <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'bullet')}
    on:click={formatBulletList}>
    <i class="icon bullet-list" />
    <span class="text">Bullet List</span>
  </DropDownItem>
  <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'number')}
    on:click={formatNumberedList}>
    <i class="icon numbered-list" />
    <span class="text">Numbered List</span>
  </DropDownItem>
  <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'check')}
    on:click={formatCheckList}>
    <i class="icon check-list" />
    <span class="text">Check List</span>
  </DropDownItem>
  <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'quote')}
    on:click={formatQuote}>
    <i class="icon quote" />
    <span class="text">Quote</span>
  </DropDownItem>
  <!-- <DropDownItem
    class={'item ' + dropDownActiveClass($blockType === 'code')}
    on:click={formatCode}>
    <i class="icon code" />
    <span class="text">Code Block</span>
  </DropDownItem> -->
</DropDown>
