/**
 * Copyright (c) Syed Umar Anis.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorConfig,
  LexicalNode,
  SerializedTextNode,
  Spread,
} from 'lexical';

import {TextNode} from 'lexical';

export type SerializedHashtagNode = Spread<
  {
    type: 'hashtag';
    version: 1;
  },
  SerializedTextNode
>;

export class HashtagNode extends TextNode {
  static getType(): string {
    return 'hashtag';
  }

  static clone(node: HashtagNode): HashtagNode {
    return new HashtagNode(node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedHashtagNode): HashtagNode {
    const node = $createHashtagNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedHashtagNode {
    return {
      ...super.exportJSON(),
      type: 'hashtag',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cursor = 'default';
    dom.className = 'hashtag';
    return dom;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return true;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createHashtagNode(hashtag: string): HashtagNode {
  return new HashtagNode(hashtag);
}

export function $isHashtagNode(
  node: LexicalNode | null | undefined | undefined,
): boolean {
  return node instanceof HashtagNode;
}
