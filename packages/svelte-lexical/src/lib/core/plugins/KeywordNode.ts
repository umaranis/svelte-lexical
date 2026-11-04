/**
 * Copyright (c) Syed Umar Anis.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedTextNode,
} from 'lexical';

import {registerLexicalTextEntity} from '@lexical/text';
import {
  $applyNodeReplacement,
  defineExtension,
  mergeRegister,
  safeCast,
  TextNode,
} from 'lexical';

export type SerializedKeywordNode = SerializedTextNode;

export class KeywordNode extends TextNode {
  static getType(): string {
    return 'keyword';
  }

  static clone(node: KeywordNode): KeywordNode {
    return new KeywordNode(node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedKeywordNode): KeywordNode {
    return $createKeywordNode().updateFromJSON(serializedNode);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cursor = 'default';
    dom.className = 'keyword';
    return dom;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createKeywordNode(keyword: string = ''): KeywordNode {
  return $applyNodeReplacement(new KeywordNode(keyword));
}

export function $isKeywordNode(
  node: LexicalNode | null | undefined | undefined,
): boolean {
  return node instanceof KeywordNode;
}

function $convertToKeywordNode(textNode: TextNode): KeywordNode {
  return $createKeywordNode(textNode.getTextContent());
}

/**
 * Converts text matching `keywordsRegex` into KeywordNodes.
 * The regex must capture the keyword in its second group, with the preceding boundary in the first.
 */
export function registerKeywords(
  editor: LexicalEditor,
  keywordsRegex: RegExp,
): () => void {
  function getKeywordMatch(text: string) {
    const matchArr = keywordsRegex.exec(text);

    if (matchArr === null) {
      return null;
    }

    const keywordLength = matchArr[2].length;
    const startOffset = matchArr.index + matchArr[1].length;
    const endOffset = startOffset + keywordLength;
    return {
      end: endOffset,
      start: startOffset,
    };
  }

  return mergeRegister(
    ...registerLexicalTextEntity(
      editor,
      getKeywordMatch,
      KeywordNode,
      $convertToKeywordNode,
    ),
  );
}

export interface KeywordsConfig {
  /** When null, only KeywordNode is registered and no text is converted. */
  keywordsRegex: RegExp | null;
}

export const KeywordsExtension = /*#__PURE__*/ defineExtension({
  config: safeCast<KeywordsConfig>({keywordsRegex: null}),
  name: '@svelte-lexical/Keywords',
  nodes: () => [KeywordNode],
  register: (editor, {keywordsRegex}) =>
    keywordsRegex ? registerKeywords(editor, keywordsRegex) : () => {},
});
