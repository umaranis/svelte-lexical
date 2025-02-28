<script lang="ts">
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    $isRootOrShadowRoot as isRootOrShadowRoot,
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
    $findMatchingParent as findMatchingParent,
    $getNearestNodeOfType as getNearestNodeOfType,
    mergeRegister,
    $isEditorIsNestedEditor as isEditorIsNestedEditor,
  } from '@lexical/utils';
  import {getContext, onMount} from 'svelte';
  import {$isCodeNode as isCodeNode, CODE_LANGUAGE_MAP} from '@lexical/code';

  import {getActiveEditor, getEditor} from '$lib/core/composerContext.js';
  import type {Writable} from 'svelte/store';
  import getSelectedNode from './getSelectionInfo.js';
  import {$isLinkNode as isLinkNode} from '@lexical/link';
  import {blockTypeToBlockName} from './ToolbarData.js';
  import {$isTableSelection as isTableSelection} from '@lexical/table';

  const editor = getEditor();
  const activeEditor = getActiveEditor();

  const isBold: Writable<boolean> = getContext('isBold');
  const isItalic: Writable<boolean> = getContext('isItalic');
  const isUnderline: Writable<boolean> = getContext('isUnderline');
  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
  const isSubscript: Writable<boolean> = getContext('isSubscript');
  const isSuperscript: Writable<boolean> = getContext('isSuperscript');
  const isCode: Writable<boolean> = getContext('isCode');
  const blockType: Writable<string> = getContext('blockType');
  const selectedElementKey: Writable<string | null> =
    getContext('selectedElementKey');
  const isRTL: Writable<boolean> = getContext('isRTL');
  const codeLanguage: Writable<string> = getContext('codeLanguage');
  const fontSize: Writable<string> = getContext('fontSize');
  const fontFamily: Writable<string> = getContext('fontFamily');
  const fontColor: Writable<string> = getContext('fontColor');
  const bgColor: Writable<string> = getContext('bgColor');
  const isLink: Writable<boolean> = getContext('isLink');
  const isImageCaption: Writable<boolean> = getContext('isImageCaption');

  const updateToolbar = () => {
    const selection = getSelection();
    if (isRangeSelection(selection)) {
      if ($activeEditor !== editor && isEditorIsNestedEditor($activeEditor)) {
        const rootElement = $activeEditor.getRootElement();
        $isImageCaption = !!rootElement?.parentElement?.classList.contains(
          'image-caption-container',
        );
      } else {
        $isImageCaption = false;
      }
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = $activeEditor.getElementByKey(elementKey);

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
          if (type in blockTypeToBlockName) {
            $blockType = type as keyof typeof blockTypeToBlockName;
          }
          if (isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            $codeLanguage = language
              ? CODE_LANGUAGE_MAP[language] || language
              : '';
            return;
          }
        }
      }
      // Hande buttons
      $fontColor = getSelectionStyleValueForProperty(
        selection,
        'color',
        '#000',
      );
      $bgColor = getSelectionStyleValueForProperty(
        selection,
        'background-color',
        '#fff',
      );
      $fontFamily = getSelectionStyleValueForProperty(
        selection,
        'font-family',
        'Arial',
      );
    }

    //TODO: create a separate toolbar updator that doesn't suppprt tables (doesn't use isTableSelection) and save on package size
    if (isRangeSelection(selection) || isTableSelection(selection)) {
      // Update text format
      $isBold = selection.hasFormat('bold');
      $isItalic = selection.hasFormat('italic');
      $isUnderline = selection.hasFormat('underline');
      $isStrikethrough = selection.hasFormat('strikethrough');
      $isSubscript = selection.hasFormat('subscript');
      $isSuperscript = selection.hasFormat('superscript');
      $isCode = selection.hasFormat('code');

      $fontSize = getSelectionStyleValueForProperty(
        selection,
        'font-size',
        '15px',
      );
    }
  };

  // unregisters onDestory using returned callback
  onMount(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $activeEditor = newEditor;
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  });
</script>
