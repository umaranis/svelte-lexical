import {
  $isAutoLinkNode,
  $isLinkNode,
  LinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import {
  $findMatchingParent,
  $wrapNodeInElement,
  isHTMLElement,
  mergeRegister,
} from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  defineExtension,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  getDOMSelectionFromTarget,
  type LexicalCommand,
  type LexicalEditor,
  safeCast,
} from 'lexical';
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  type ImagePayload,
} from './ImageNode.js';

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

export type InsertImagePayload = ImagePayload;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export interface ImagesConfig {
  captionsEnabled: boolean;
}

/** Handles INSERT_IMAGE_COMMAND and dragging images within the editor. */
export function registerImages(
  editor: LexicalEditor,
  {captionsEnabled}: ImagesConfig = {captionsEnabled: true},
): () => void {
  const img = document.createElement('img');
  img.src = TRANSPARENT_IMAGE;

  return mergeRegister(
    editor.registerCommand<InsertImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        payload.captionsEnabled = captionsEnabled;
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
          $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
    editor.registerCommand<DragEvent>(
      DRAGSTART_COMMAND,
      (event) => onDragStart(event, img),
      COMMAND_PRIORITY_HIGH,
    ),
    editor.registerCommand<DragEvent>(
      DRAGOVER_COMMAND,
      (event) => onDragover(event),
      COMMAND_PRIORITY_LOW,
    ),
    editor.registerCommand<DragEvent>(
      DROP_COMMAND,
      (event) => onDrop(event, editor),
      COMMAND_PRIORITY_HIGH,
    ),
  );
}

export const ImagesExtension = defineExtension({
  config: safeCast<ImagesConfig>({captionsEnabled: true}),
  name: '@svelte-lexical/Images',
  nodes: () => [ImageNode],
  register: (editor, config) => registerImages(editor, config),
});

function onDragStart(event: DragEvent, img: HTMLImageElement): boolean {
  const node = $getImageNodeInSelection();
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
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return false;
}

function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = $getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  const existingLink = $findMatchingParent(
    node,
    (parent): parent is LinkNode =>
      !$isAutoLinkNode(parent) && $isLinkNode(parent),
  );
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
    if (existingLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, existingLink.getURL());
    }
  }
  return true;
}

function $getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
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
    isHTMLElement(target) &&
    !target.closest('code, span.editor-image') &&
    isHTMLElement(target.parentElement) &&
    target.parentElement.closest('div.ContentEditable__root')
  );
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const domSelection = getDOMSelectionFromTarget(event.target);
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
