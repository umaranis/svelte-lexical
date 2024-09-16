import type {
  DOMConversionMap,
  EditorConfig,
  LexicalNode,
  SerializedElementNode,
  NodeKey,
} from 'lexical';

import {ElementNode} from 'lexical';
import type {LexicalCommand} from 'lexical';
import {createCommand} from 'lexical';
import {addClassNamesToElement} from '@lexical/utils';

export type SerializedLayoutItemNode = SerializedElementNode;

export const INSERT_LAYOUT_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_LAYOUT_COMMAND',
);

export const UPDATE_LAYOUT_COMMAND: LexicalCommand<{
  template: string;
  nodeKey: NodeKey;
}> = createCommand<{template: string; nodeKey: NodeKey}>();

export class LayoutItemNode extends ElementNode {
  static getType(): string {
    return 'layout-item';
  }

  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('div');
    if (typeof config.theme.layoutItem === 'string') {
      addClassNamesToElement(dom, config.theme.layoutItem);
    }
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(): LayoutItemNode {
    return $createLayoutItemNode();
  }

  isShadowRoot(): boolean {
    return true;
  }

  exportJSON(): SerializedLayoutItemNode {
    return {
      ...super.exportJSON(),
      type: 'layout-item',
      version: 1,
    };
  }
}

export function $createLayoutItemNode(): LayoutItemNode {
  return new LayoutItemNode();
}

export function $isLayoutItemNode(
  node: LexicalNode | null | undefined,
): node is LayoutItemNode {
  return node instanceof LayoutItemNode;
}
