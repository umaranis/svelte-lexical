<script lang="ts">
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';
  import {$isHeadingNode as isHeadingNode} from '@lexical/rich-text';
  import {ListNode, $isListNode as isListNode} from '@lexical/list';
  import {$getNearestNodeOfType as getNearestNodeOfType} from '@lexical/utils';
  import {getContext, onMount} from 'svelte';
  import {getEditor} from '../../core/svelteContext';
  import type {Writable} from 'svelte/store';

  const isBold: Writable<boolean> = getContext('isBold');
  const isItalic: Writable<boolean> = getContext('isItalic');
  const isUnderline: Writable<boolean> = getContext('isUnderline');
  const isStrikethrough: Writable<boolean> = getContext('isStrikethrough');
  const blockType: Writable<string> = getContext('blockType');
  const selectedElementKey: Writable<string | null> =
    getContext('selectedElementKey');

  const editor = getEditor();

  const updateState = () => {
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
        }
      }
    }
  };

  // unregisters onDestory using returned callback
  onMount(() => {
    editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        updateState();
      });
    });
  });
</script>
