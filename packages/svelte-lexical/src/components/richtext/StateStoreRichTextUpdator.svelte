<script lang="ts">
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    SELECTION_CHANGE_COMMAND,
  } from 'lexical';
  import {
    $isParentElementRTL as isParentElementRTL,
    $getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
  } from '@lexical/selection';
  import {$isHeadingNode as isHeadingNode} from '@lexical/rich-text';
  import {ListNode, $isListNode as isListNode} from '@lexical/list';
  import {
    $getNearestNodeOfType as getNearestNodeOfType,
    mergeRegister,
  } from '@lexical/utils';
  import {getContext, onMount} from 'svelte';

  import {getActiveEditor, getEditor} from '../../core/svelteContext';
  import type {Writable} from 'svelte/store';
  import getSelectedNode from '../toolbar/getSelectionInfo';
  import {$isLinkNode as isLinkNode} from '@lexical/link';

  const editor = getEditor();
  const activeEditor = getActiveEditor();

  const isBold: Writable<boolean> = getContext('isBold');
  const isItalic: Writable<boolean> = getContext('isItalic');
  const isUnderline: Writable<boolean> = getContext('isUnderline');
  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
  const blockType: Writable<string> = getContext('blockType');
  const selectedElementKey: Writable<string | null> =
    getContext('selectedElementKey');
  const isRTL: Writable<boolean> = getContext('isRTL');
  const fontSize: Writable<string> = getContext('fontSize');
  const fontFamily: Writable<string> = getContext('fontFamily');
  const isLink: Writable<boolean> = getContext('isLink');

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
          const parentList = getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
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
      $fontSize = getSelectionStyleValueForProperty(
        selection,
        'font-size',
        '15px',
      );
      $fontFamily = getSelectionStyleValueForProperty(
        selection,
        'font-family',
        'Arial',
      );
    }
  };

  // unregisters onDestory using returned callback
  onMount(() => {
    mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          $activeEditor = newEditor;
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  });
</script>
