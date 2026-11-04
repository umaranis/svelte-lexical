// @vitest-environment jsdom
import {$dfs} from '@lexical/utils';
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import {
  $getRoot,
  $insertNodes,
  $selectAll,
  $setSelection,
  createEditor,
  type LexicalEditor,
} from 'lexical';
import {beforeEach, describe, expect, it} from 'vitest';

import {$createImageNode, $isImageNode, ImageNode} from './ImageNode.js';

// Strips whitespace between tags and sorts attributes so markup compares by structure.
function normalizeHtml(html: string) {
  const template = document.createElement('template');
  template.innerHTML = html.replace(/>\s+</g, '><').trim();
  for (const element of template.content.querySelectorAll('*')) {
    const attributes = [...element.attributes].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    for (const {name, value} of attributes) {
      element.removeAttribute(name);
      element.setAttribute(name, value);
    }
  }
  return template.innerHTML;
}

describe('ImageNode HTML serialization', () => {
  let editor: LexicalEditor;

  beforeEach(() => {
    editor = createEditor({
      nodes: [ImageNode],
      onError: (error) => {
        throw error;
      },
    });
  });

  describe('ImageNode export', () => {
    it('with no caption', () => {
      editor.update(
        () => {
          const imageNode = $createImageNode({
            altText: '',
            src: '/test/image.jpg',
          });
          $selectAll().insertNodes([imageNode]);
        },
        {discrete: true},
      );
      const doc = editor.read(() => $generateHtmlFromNodes(editor, null));
      expect(normalizeHtml(doc)).toBe(
        normalizeHtml(`
          <p>
            <img alt="" height="inherit" src="/test/image.jpg" width="inherit">
          </p>
        `),
      );
    });

    it('with plain text caption', () => {
      editor.update(
        () => {
          const imageNode = $createImageNode({
            altText: '',
            showCaption: true,
            src: '/test/image.jpg',
          });
          imageNode.__caption.update(
            () => {
              $selectAll().insertRawText('caption text');
              $setSelection(null);
            },
            {discrete: true},
          );
          $selectAll().insertNodes([imageNode]);
        },
        {discrete: true},
      );
      const doc = editor.read(() => $generateHtmlFromNodes(editor, null));
      expect(normalizeHtml(doc)).toBe(
        normalizeHtml(`
          <p>
            <figure>
              <img alt="" height="inherit" src="/test/image.jpg" width="inherit">
              <figcaption>
                <span style="white-space: pre-wrap;">caption text</span>
              </figcaption>
            </figure>
          </p>
        `),
      );
    });
  });

  describe('ImageNode import', () => {
    it('restores the figcaption into the caption editor', () => {
      const dom = new DOMParser().parseFromString(
        `<figure>
          <img alt="" src="/test/image.jpg">
          <figcaption>caption text</figcaption>
        </figure>`,
        'text/html',
      );
      editor.update(
        () => {
          $getRoot().clear().select();
          $insertNodes($generateNodesFromDOM(editor, dom));
        },
        {discrete: true},
      );
      const imageNode = editor.read(
        () => $dfs().find(({node}) => $isImageNode(node))?.node,
      );
      expect($isImageNode(imageNode)).toBe(true);
      const image = imageNode as ImageNode;
      expect(image.__showCaption).toBe(true);
      expect(image.__caption.read(() => $getRoot().getTextContent())).toBe(
        'caption text',
      );
    });
  });
});
