import { DecoratorNode } from 'lexical';
import ImageNodeSvelte from './ImageNodeSvelte.svelte';

export class ImageNode extends DecoratorNode {
  /** @type {string} */
  __src;

  /** @type {string} */
  __altText;

  /** @type {'inherit' | number} */
  __width;

  /** @type {'inherit' | number} */
  __height;

  /** @type { number } */
  __maxWidth;

  /** @type {boolean} */
  __showCaption;

  /** @type {LexicalEditor} */
  __caption;

  /** @returns {string} */
  static getType() {
    return 'image';
  }

  /**
     *
     * @param {ImageNode} node
     * @returns {ImageNode}
     */
  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key,
    );
  }

  /**
     *
     * @param {string} src
     * @param {string} altText
     * @param {number} maxWidth
     * @param {'inherit' | number} [width]
     * @param {'inherit' | number} [height ]
     * @param {boolean} [showCaption]
     * @param {LexicalEditor} [caption]
     * @param {NodeKey} [key]
     */
  constructor(
    src,
    altText,
    maxWidth,
    width,
    height,
    showCaption,
    caption,
    key,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__showCaption = showCaption || false;
    this.__caption = caption; // TODO: createEditor() - lexical calls createEditor to create an editor here (works with the same toolbar)
  }

  /**
     *
     * @param {'inherit' | number} width
     * @param {'inherit' | number} height
     * @return {void}
     */
  setWidthAndHeight(
    width,
    height,
  ) {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  /**
     *
     * @param {boolean} showCaption
     * @returns {void}
     */
  setShowCaption(showCaption) {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  // View

  /**
     *
     * @param {EditorConfig<EditorContext>} config
     * @returns {HTMLElement}
     */
  createDOM(config) {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }

    const image = new ImageNodeSvelte(
      {
        target: span,
        props: {
          src: this.__src,
          altText: this.__altText,
        },
      },
    );

    return span;
  }

  /**
     *
     * @returns {false}
     */
  updateDOM() {
    return false;
  }

  decorate() {
    // return (
    //   <ImageComponent
    //     src={this.__src}
    //     altText={this.__altText}
    //     width={this.__width}
    //     height={this.__height}
    //     maxWidth={this.__maxWidth}
    //     nodeKey={this.getKey()}
    //     showCaption={this.__showCaption}
    //     caption={this.__caption}
    //     resizable={true}
    //   />
    // );
  }
}

/**
   *
   * @param {string} src
   * @param {altText} altText
   * @param {number} maxWidth
   * @returns {ImageNode}
   */
export function $createImageNode(
  src,
  altText,
  maxWidth,
) {
  return new ImageNode(src, altText, maxWidth);
}

/**
   *
   * @param {LexicalNode} node
   * @returns {boolean}
   */
export function $isImageNode(node) {
  return node instanceof ImageNode;
}
