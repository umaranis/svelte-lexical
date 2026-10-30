// @vitest-environment jsdom
import {$generateHtmlFromNodes, $generateNodesFromDOM} from '@lexical/html';
import {
  $getRoot,
  $insertNodes,
  createEditor,
  type LexicalEditor,
} from 'lexical';
import {beforeEach, describe, expect, it} from 'vitest';

import {
  $createLayoutContainerNode,
  LayoutContainerNode,
} from './LayoutContainerNode.js';
import {LayoutItemNode} from './LayoutItemNode.js';

describe('LayoutContainerNode HTML serialization', () => {
  let editor: LexicalEditor;

  beforeEach(() => {
    editor = createEditor({
      nodes: [LayoutContainerNode, LayoutItemNode],
      onError: (error) => {
        throw error;
      },
    });
  });

  function importHtml(htmlString: string) {
    const dom = new DOMParser().parseFromString(htmlString, 'text/html');
    editor.update(
      () => {
        $getRoot().clear();
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().select();
        $insertNodes(nodes);
      },
      {discrete: true},
    );
  }

  function exportHtml(templateColumns: string) {
    editor.update(
      () => {
        $getRoot().append($createLayoutContainerNode(templateColumns));
      },
      {discrete: true},
    );
    return editor.read(() => $generateHtmlFromNodes(editor, null));
  }

  function getFirstChild() {
    return editor.read(() => $getRoot().getFirstChild());
  }

  it('exports with inline grid-template-columns style', () => {
    const container = document.createElement('div');
    container.innerHTML = exportHtml('1fr 1fr');
    const div = container.firstElementChild as HTMLElement;
    expect(div.getAttribute('data-lexical-layout-container')).toBe('true');
    expect(div.style.gridTemplateColumns).toBe('1fr 1fr');
  });

  it('imports layout container from inline style', () => {
    importHtml(
      '<div data-lexical-layout-container="true" style="grid-template-columns: 1fr 1fr;"></div>',
    );
    const container = getFirstChild();
    expect(container).toBeInstanceOf(LayoutContainerNode);
    expect(
      editor.read(() =>
        (container as LayoutContainerNode).getTemplateColumns(),
      ),
    ).toBe('1fr 1fr');
  });

  it('returns null for div without data-lexical-layout-container', () => {
    importHtml('<div style="grid-template-columns: 1fr 1fr;"></div>');
    const hasLayoutContainer = editor.read(() =>
      $getRoot()
        .getChildren()
        .some((child) => child instanceof LayoutContainerNode),
    );
    expect(hasLayoutContainer).toBe(false);
  });

  it.each(['1fr 1fr', '1fr 1fr 1fr'])(
    'preserves templateColumns "%s" through HTML round-trip',
    (templateColumns) => {
      importHtml(exportHtml(templateColumns));
      const container = getFirstChild();
      expect(container).toBeInstanceOf(LayoutContainerNode);
      expect(
        editor.read(() =>
          (container as LayoutContainerNode).getTemplateColumns(),
        ),
      ).toBe(templateColumns);
    },
  );
});
