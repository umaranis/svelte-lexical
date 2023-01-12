<script>
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';
  import {
    $isParentElementRTL as isParentElementRTL,
    $getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
  } from '@lexical/selection';
  import { $isHeadingNode as isHeadingNode } from '@lexical/rich-text';
  import { ListNode, $isListNode as isListNode } from '@lexical/list';
  import { $getNearestNodeOfType as getNearestNodeOfType } from '@lexical/utils';
  import { getContext, onMount } from 'svelte';

  import {
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    blockType,
    selectedElementKey,
  } from '../editor-state/StateStoreBasic';
  import { isRTL, fontSize, fontFamily } from '../editor-state/StateStoreRichText';

  const editor = getContext('editor');

  const updateState = () => {
    const selection = getSelection();
    if (isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Update text format
      $isBold = selection.hasFormat('bold');
      $isItalic = selection.hasFormat('italic');
      $isUnderline = selection.hasFormat('underline');
      $isStrikethrough = selection.hasFormat('strikethrough');
      $isRTL = isParentElementRTL(selection);

      // Update links
      // const node = getSelectedNode(selection);
      // const parent = node.getParent();
      // if (isLinkNode(parent) || isLinkNode(node)) {
      //   $isLink = true;
      // } else {
      //   $isLink = false;
      // }

      if (elementDOM !== null) {
        $selectedElementKey = elementKey;
        if (isListNode(element)) {
          const parentList = getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          $blockType = type;
        } else {
          const type = isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          $blockType = type;
          // if (isCodeNode(element)) {
          //   setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          //   return;
          // }
        }
      }
      // Hande buttons
      $fontSize = getSelectionStyleValueForProperty(selection, 'font-size', '15px');
      $fontFamily = getSelectionStyleValueForProperty(selection, 'font-family', 'Arial');
    }
  };

  // unregisters onDestory using returned callback
  onMount(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateState();
      });
    });
  });
</script>
