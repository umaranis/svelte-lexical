import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalEditorWithDispose,
  LexicalNode,
  LexicalUpdateJSON,
  NodeKey,
  RangeSelection,
  SerializedEditor,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import {
  $applyNodeReplacement,
  $createRangeSelection,
  $extendCaretToRange,
  $getChildCaret,
  $getEditor,
  $getRoot,
  $isElementNode,
  $isParagraphNode,
  $selectAll,
  $setSelection,
  configExtension,
  DecoratorNode,
  defineExtension,
  SKIP_DOM_SELECTION_TAG,
} from 'lexical';
import {
  buildEditorFromExtensions,
  NestedEditorExtension,
} from '@lexical/extension';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import type {ComponentProps} from 'svelte';
import ImageComponent from './ImageComponent.svelte';
import {LinkExtension} from '@lexical/link';
import {HashtagExtension} from '@lexical/hashtag';
import {RichTextExtension} from '@lexical/rich-text';
import {KeywordsExtension} from '../KeywordNode.js';
/*import * as React from 'react';
import {Suspense} from 'react';*/

/*const ImageComponent = React.lazy(
  // @ts-ignore
  () => import('./ImageComponent'),
);*/

// History (shared or collaborative) is still provided by the caption's history
// plugin component, see CaptionEditorHistoryPlugin and CaptionEditorCollaborationPlugin.
const CaptionEditorExtension = defineExtension({
  dependencies: [
    configExtension(NestedEditorExtension, {
      // the parent editor is created by Composer, not LexicalBuilder
      $getParentEditor: $getEditor,
      inheritEditableFromParent: true,
    }),
    RichTextExtension,
    HashtagExtension,
    LinkExtension,
    KeywordsExtension,
  ],
  name: '@svelte-lexical/ImageNodeCaption',
  namespace: 'svelte-lexical/ImageNodeCaption',
});

export interface ImagePayload {
  altText: string;
  caption?: LexicalEditorWithDispose;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  showCaption?: boolean;
  src: string;
  width?: number;
  captionsEnabled?: boolean;
}

function isGoogleDocCheckboxImg(img: HTMLImageElement): boolean {
  return (
    img.parentElement != null &&
    img.parentElement.tagName === 'LI' &&
    img.previousSibling === null &&
    img.getAttribute('aria-roledescription') === 'checkbox'
  );
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  const img = domNode as HTMLImageElement;
  const src = img.getAttribute('src');
  if (!src || src.startsWith('file:///') || isGoogleDocCheckboxImg(img)) {
    return null;
  }
  const {alt: altText, width, height} = img;
  const node = $createImageNode({altText, height, src, width});
  return {node};
}

export function $isCaptionEditorEmpty(): boolean {
  // Search the document for any non-element node
  // to determine if it's empty or not
  for (const {origin} of $extendCaretToRange(
    $getChildCaret($getRoot(), 'next'),
  )) {
    if (!$isElementNode(origin)) {
      return false;
    }
  }
  return true;
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: number;
    maxWidth: number;
    showCaption: boolean;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

type DecoratorImageType = {
  componentClass: typeof ImageComponent;
  updateProps: (props: ComponentProps<typeof ImageComponent>) => void;
};

export class ImageNode extends DecoratorNode<DecoratorImageType> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;
  __showCaption: boolean;
  __caption: LexicalEditorWithDispose;
  // Captions cannot yet be used within editor cells
  __captionsEnabled: boolean;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__captionsEnabled,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {altText, height, width, maxWidth, src, showCaption} = serializedNode;
    return $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width,
    }).updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode: LexicalUpdateJSON<SerializedImageNode>): this {
    const node = super.updateFromJSON(serializedNode);
    const {caption} = serializedNode;
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  exportDOM(): DOMExportOutput {
    const imgElement = document.createElement('img');
    imgElement.setAttribute('src', this.__src);
    imgElement.setAttribute('alt', this.__altText);
    imgElement.setAttribute('width', this.__width.toString());
    imgElement.setAttribute('height', this.__height.toString());

    if (this.__showCaption && this.__caption) {
      const captionEditor = this.__caption;
      const captionHtml = captionEditor.read(() => {
        if ($isCaptionEditorEmpty()) {
          return null;
        }
        // Don't serialize the wrapping paragraph if there is only one
        let selection: null | RangeSelection = null;
        const firstChild = $getRoot().getFirstChild();
        if (
          $isParagraphNode(firstChild) &&
          firstChild.getNextSibling() === null
        ) {
          selection = $createRangeSelection();
          selection.anchor.set(firstChild.getKey(), 0, 'element');
          selection.focus.set(
            firstChild.getKey(),
            firstChild.getChildrenSize(),
            'element',
          );
        }
        return $generateHtmlFromNodes(captionEditor, selection);
      });
      if (captionHtml) {
        const figureElement = document.createElement('figure');
        const figcaptionElement = document.createElement('figcaption');
        figcaptionElement.innerHTML = captionHtml;

        figureElement.appendChild(imgElement);
        figureElement.appendChild(figcaptionElement);

        return {element: figureElement};
      }
    }

    return {element: imgElement};
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figcaption: () => ({
        conversion: () => ({node: null}),
        priority: 0,
      }),
      figure: () => ({
        conversion: (node) => {
          return {
            after: (childNodes) => {
              const imageNodes = childNodes.filter($isImageNode);
              const figcaption = node.querySelector('figcaption');
              if (figcaption) {
                for (const imgNode of imageNodes) {
                  imgNode.setShowCaption(true);
                  imgNode.__caption.update(
                    () => {
                      $selectAll().insertNodes(
                        $generateNodesFromDOM(imgNode.__caption, figcaption),
                      );
                      $setSelection(null);
                    },
                    {tag: SKIP_DOM_SELECTION_TAG},
                  );
                }
              }
              return imageNodes;
            },
            node: null,
          };
        },
        priority: 0,
      }),
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    showCaption?: boolean,
    caption?: LexicalEditorWithDispose,
    captionsEnabled?: boolean,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__showCaption = showCaption || false;
    this.__caption =
      caption || buildEditorFromExtensions(CaptionEditorExtension);
    this.__captionsEnabled = captionsEnabled !== false;
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(editor: LexicalEditor, config: EditorConfig): DecoratorImageType {
    return {
      componentClass: ImageComponent,
      updateProps: (props) => {
        props.src = this.__src;
        props.altText = this.__altText;
        props.width = this.__width;
        props.height = this.__height;
        props.maxWidth = this.__maxWidth;
        props.nodeKey = this.__key;
        props.showCaption = this.__showCaption;
        props.caption = this.__caption;
        props.captionsEnabled = this.__captionsEnabled;
        props.resizable = true;
        props.editor = editor;
      },
    };
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  captionsEnabled,
  src,
  width,
  showCaption,
  caption,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      altText,
      maxWidth,
      width,
      height,
      showCaption,
      caption,
      captionsEnabled,
      key,
    ),
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
