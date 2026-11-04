// @vitest-environment jsdom
import {buildEditorFromExtensions} from '@lexical/extension';
import {$dfs} from '@lexical/utils';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  configExtension,
  type LexicalNode,
} from 'lexical';
import {describe, expect, it} from 'vitest';

import {DateTimeExtension} from './DateTime/DateTimeExtension.js';
import {
  $isDateTimeNode,
  INSERT_DATETIME_COMMAND,
} from './DateTime/DateTimeNode.js';
import {ImagesExtension, INSERT_IMAGE_COMMAND} from './Image/ImageExtension.js';
import {$isImageNode} from './Image/ImageNode.js';
import {$isKeywordNode, KeywordNode, KeywordsExtension} from './KeywordNode.js';

function $findNode<T extends LexicalNode>(
  predicate: (node: LexicalNode) => node is T,
): T | undefined {
  return $dfs().find(({node}) => predicate(node))?.node as T | undefined;
}

describe('svelte-lexical extensions', () => {
  it('KeywordsExtension converts matching text to KeywordNode', () => {
    const editor = buildEditorFromExtensions(
      configExtension(KeywordsExtension, {
        keywordsRegex: /(^|\s)(congrats)(\s|$)/i,
      }),
    );
    editor.update(
      () => {
        $getRoot().append(
          $createParagraphNode().append($createTextNode('big congrats today')),
        );
      },
      {discrete: true},
    );
    const keyword = editor.read(() =>
      $findNode((node): node is KeywordNode =>
        $isKeywordNode(node as KeywordNode),
      ),
    );
    expect(keyword).toBeDefined();
    expect(editor.read(() => keyword!.getTextContent())).toBe('congrats');
  });

  it('DateTimeExtension handles INSERT_DATETIME_COMMAND', () => {
    const editor = buildEditorFromExtensions(DateTimeExtension);
    editor.update(
      () => {
        $getRoot().append($createParagraphNode()).selectEnd();
        editor.dispatchCommand(INSERT_DATETIME_COMMAND, {
          dateTime: new Date(2026, 0, 1),
        });
      },
      {discrete: true},
    );
    expect(editor.read(() => $findNode($isDateTimeNode))).toBeDefined();
  });

  it('ImagesExtension inserts images with a caption editor', () => {
    const editor = buildEditorFromExtensions(
      configExtension(ImagesExtension, {captionsEnabled: false}),
    );
    editor.update(
      () => {
        $getRoot().append($createParagraphNode()).selectEnd();
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: '',
          src: '/test/image.jpg',
        });
      },
      {discrete: true},
    );
    const image = editor.read(() => $findNode($isImageNode));
    expect(image).toBeDefined();
    expect(image!.__captionsEnabled).toBe(false);
    expect(image!.__caption._parentEditor).toBe(editor);
  });
});
