<script context="module" lang="ts">
  declare global {
    interface DragEvent {
      rangeOffset?: number;
      rangeParent?: Node;
    }
  }

  export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
    createCommand();
  export type InsertImagePayload = Readonly<ImagePayload>;

  const getDOMSelection = (targetWindow: Window | null): Selection | null =>
    CAN_USE_DOM ? (targetWindow || window).getSelection() : null;
</script>

<script lang="ts">
  import {
    $createParagraphNode as createParagraphNode,
    $createRangeSelection as createRangeSelection,
    $getSelection as getSelection,
    $insertNodes as insertNodes,
    $isNodeSelection as isNodeSelection,
    $isRootOrShadowRoot as isRootOrShadowRoot,
    $setSelection as setSelection,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    createCommand,
    DRAGOVER_COMMAND,
    DRAGSTART_COMMAND,
    DROP_COMMAND,
    type LexicalCommand,
    type LexicalEditor,
  } from 'lexical';
  import {
    $wrapNodeInElement as wrapNodeInElement,
    mergeRegister,
  } from '@lexical/utils';

  import {onMount, getContext} from 'svelte';
  import {
    $createImageNode as createImageNode,
    $isImageNode as isImageNode,
    ImageNode,
    type ImagePayload,
  } from './ImageNode';
  import {CAN_USE_DOM} from '../../utils/canUseDOM';

  const editor: LexicalEditor = getContext('editor');

  onMount(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
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
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  });

  const TRANSPARENT_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const img = document.createElement('img');
  img.src = TRANSPARENT_IMAGE;

  function onDragStart(event: DragEvent): boolean {
    const node = getImageNodeInSelection();
    if (!node) {
      return false;
    }
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
      return false;
    }
    dataTransfer.setData('text/plain', '_');
    dataTransfer.setDragImage(img, 0, 0);
    dataTransfer.setData(
      'application/x-lexical-drag',
      JSON.stringify({
        data: {
          altText: node.__altText,
          caption: node.__caption,
          height: node.__height,
          key: node.getKey(),
          maxWidth: node.__maxWidth,
          showCaption: node.__showCaption,
          src: node.__src,
          width: node.__width,
        },
        type: 'image',
      }),
    );

    return true;
  }

  function onDragover(event: DragEvent): boolean {
    const node = getImageNodeInSelection();
    if (!node) {
      return false;
    }
    if (!canDropImage(event)) {
      event.preventDefault();
    }
    return true;
  }

  function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
    const node = getImageNodeInSelection();
    if (!node) {
      return false;
    }
    const data = getDragImageData(event);
    if (!data) {
      return false;
    }
    event.preventDefault();
    if (canDropImage(event)) {
      const range = getDragSelection(event);
      node.remove();
      const rangeSelection = createRangeSelection();
      if (range !== null && range !== undefined) {
        rangeSelection.applyDOMRange(range);
      }
      setSelection(rangeSelection);
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
    }
    return true;
  }

  function getImageNodeInSelection(): ImageNode | null {
    const selection = getSelection();
    if (!isNodeSelection(selection)) {
      return null;
    }
    const nodes = selection.getNodes();
    const node = nodes[0];
    return isImageNode(node) ? node : null;
  }

  function getDragImageData(event: DragEvent): null | InsertImagePayload {
    const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
    if (!dragData) {
      return null;
    }
    const {type, data} = JSON.parse(dragData);
    if (type !== 'image') {
      return null;
    }

    return data;
  }

  function canDropImage(event: DragEvent): boolean {
    const target = event.target;
    return !!(
      target &&
      target instanceof HTMLElement &&
      !target.closest('code, span.editor-image') &&
      target.parentElement &&
      target.parentElement.closest('div.ContentEditable__root')
    );
  }

  function getDragSelection(event: DragEvent): Range | null | undefined {
    let range;
    const target = event.target as null | Element | Document;
    const targetWindow =
      target == null
        ? null
        : target.nodeType === 9
        ? (target as Document).defaultView
        : (target as Element).ownerDocument.defaultView;
    const domSelection = getDOMSelection(targetWindow);
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(event.clientX, event.clientY);
    } else if (event.rangeParent && domSelection !== null) {
      domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
      range = domSelection.getRangeAt(0);
    } else {
      throw Error(`Cannot get the selection when dragging`);
    }

    return range;
  }
</script>
