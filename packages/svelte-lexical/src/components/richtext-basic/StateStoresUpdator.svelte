<script>
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';
  import {
    $isParentElementRTL as isParentElementRTL,
  } from '@lexical/selection';
  import { $isHeadingNode as isHeadingNode } from '@lexical/rich-text';
  import { ListNode, $isListNode as isListNode } from '@lexical/list';
  import { $getNearestNodeOfType as getNearestNodeOfType } from '@lexical/utils';
  import { getContext } from 'svelte';
  
  import {
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isCode,
    isRTL,
    blockType,
    selectedElementKey,
  } from '../toolbar/stores';
  
  const editor = getContext('editor');

  // TODO: explore mergeRegister to combine event registrations

  const updateToolbar = () => {
    const selection = getSelection();
    if (isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Update text format
      $isBold = selection.hasFormat('bold');
      $isItalic = selection.hasFormat('italic');
      $isUnderline = selection.hasFormat('underline');
      $isStrikethrough = selection.hasFormat('strikethrough');
      $isCode = selection.hasFormat('code');
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
          const parentList = getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
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
      // // Hande buttons
      // setFontSize(
      //   getSelectionStyleValueForProperty(selection, "font-size", "15px")
      // );
      // setFontFamily(
      //   getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      // );
    }
  };

  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      updateToolbar();
    });
  });
</script>
