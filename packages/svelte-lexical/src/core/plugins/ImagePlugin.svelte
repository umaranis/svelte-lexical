<script context="module" lang="ts">
  import pkg from 'lexical';
  const {createCommand} = pkg;
  /**
   * @type {LexicalCommand<{altText:string, src:string}>}
   */
  import type {ImagePayload} from './ImageNode';
  export const INSERT_IMAGE_COMMAND = createCommand();
  export type InsertImagePayload = Readonly<ImagePayload>;
</script>

<script lang="ts">
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    $isRootNode as isRootNode,
    $insertNodes as insertNodes,
    $isRootOrShadowRoot as isRootOrShadowRoot,
    $createParagraphNode as createParagraphNode,
    COMMAND_PRIORITY_EDITOR,
    type LexicalEditor,
  } from 'lexical';
  import {$wrapNodeInElement as wrapNodeInElement} from '@lexical/utils';

  import {onMount, getContext} from 'svelte';
  import {$createImageNode as createImageNode, ImageNode} from './ImageNode';

  const editor: LexicalEditor = getContext('editor');

  onMount(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand<InsertImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = createImageNode(payload);
        insertNodes([imageNode]);
        if (isRootOrShadowRoot(imageNode.getParentOrThrow())) {
          wrapNodeInElement(imageNode, createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  });
</script>
