<script>
	import BlockTypeDropDown from './BlockTypeDropDown.svelte';
  import { isBold, isItalic, isUnderline, isStrikethrough, isCode, isRTL, isLink, blockType, selectedElementKey } from "./stores.js";
  import BoldButton from "./BoldButton.svelte";
  import Divider from "./Divider.svelte";
  import RedoButton from "./RedoButton.svelte";
  import UndoButton from "./UndoButton.svelte";
  import ItalicButton from './ItalicButton.svelte';
  import UnderlineButton from './UnderlineButton.svelte';
  import StrikethroughButton from './StrikethroughButton.svelte';
  import FormatCodeButton from './FormatCodeButton.svelte';
  import LeftAlignButton from './LeftAlignButton.svelte';
  import CenterAlignButton from './CenterAlignButton.svelte';
  import RightAlignButton from './RightAlignButton.svelte';
  import JustifyAlignButton from './JustifyAlignButton.svelte';
  import {
    createEditor,
    $getRoot as getRoot,
    $createParagraphNode as createParagraphNode,
    $createTextNode as createTextNode,
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    ElementNode,
    TextNode,
  } from "lexical";
  import {
    $createHeadingNode as createHeadingNode,
    $createQuoteNode as createQuoteNode,
    $isHeadingNode as isHeadingNode,
  } from "@lexical/rich-text";
  import {
    $getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
    $isAtNodeEnd as isAtNodeEnd,
    $isParentElementRTL as isParentElementRTL,
    $patchStyleText as patchStyleText,
    $wrapLeafNodesInElements as wrapLeafNodesInElements,
  } from "@lexical/selection";
  import {
    ListItemNode,
    ListNode,
    insertList,
    $isListNode as isListNode,
  } from "@lexical/list";
  import {
    TableCellNode,
    TableNode,
    TableRowNode,
    INSERT_TABLE_COMMAND,
  } from "@lexical/table";
  import {
    $isLinkNode as isLinkNode,
    TOGGLE_LINK_COMMAND,
  } from "@lexical/link";
  import {
    $createCodeNode as createCodeNode,
    $isCodeNode as isCodeNode,
    getCodeLanguages,
    getDefaultCodeLanguage,
  } from "@lexical/code";
  import {
    $getNearestNodeOfType as getNearestNodeOfType,
    mergeRegister,
  } from "@lexical/utils";
  import { COMMAND_PRIORITY_CRITICAL } from "../utils/commandPriority.js";

  import { getContext, onMount } from "svelte";


  const editor = getContext("editor");

  let popupLeft = 0;
  let toolbar;  

  function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

  //TODO: explore mergeRegister to combine event registrations

  const updateToolbar = () => {
    const selection = getSelection();
    if (isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      // Update text format
      $isBold = selection.hasFormat("bold");
      $isItalic = selection.hasFormat("italic");
      $isUnderline = selection.hasFormat("underline");
      $isStrikethrough = selection.hasFormat("strikethrough");
      $isCode = selection.hasFormat("code");
      $isRTL = isParentElementRTL(selection);

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if (isLinkNode(parent) || isLinkNode(node)) {
        $isLink = true;
      } else {
        $isLink = false;
      }

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
          if (isCodeNode(element)) {
            //setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage()); //TODO: implement code blocks
            return;
          }
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

<div class="toolbar">
  <UndoButton />
  <RedoButton />
  <Divider />
  <BlockTypeDropDown />
  <Divider />
  <BoldButton /> 
  <ItalicButton /> 
  <UnderlineButton /> 
  <StrikethroughButton />
  <FormatCodeButton />
  <Divider />
  <LeftAlignButton />
  <CenterAlignButton />
  <RightAlignButton />
  <JustifyAlignButton />
  
</div>
