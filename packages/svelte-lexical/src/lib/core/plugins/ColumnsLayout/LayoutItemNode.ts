import type {
  DOMConversionMap,
  EditorConfig,
  LexicalNode,
  SerializedElementNode,
  NodeKey,
  DOMConversionOutput,
} from 'lexical';

import {$isParagraphNode, ElementNode} from 'lexical';
import type {LexicalCommand} from 'lexical';
import {createCommand} from 'lexical';
import {addClassNamesToElement} from '@lexical/utils';

export type SerializedLayoutItemNode = SerializedElementNode;

function $convertLayoutItemElement(): DOMConversionOutput | null {
  return {node: $createLayoutItemNode()};
}

export function $isEmptyLayoutItemNode(node: LexicalNode): boolean {
  if (!$isLayoutItemNode(node) || node.getChildrenSize() !== 1) {
    return false;
  }
  const firstChild = node.getFirstChild();
  return $isParagraphNode(firstChild) && firstChild.isEmpty();
}

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
    dom.setAttribute('data-lexical-layout-item', 'true');
    if (typeof config.theme.layoutItem === 'string') {
      addClassNamesToElement(dom, config.theme.layoutItem);
    }
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  collapseAtStart(): boolean {
    const parent = this.getParentOrThrow();
    if (
      this.is(parent.getFirstChild()) &&
      parent.getChildren().every($isEmptyLayoutItemNode)
    ) {
      parent.remove();
      return true;
    }
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-layout-item')) {
          return null;
        }
        return {
          conversion: $convertLayoutItemElement,
          priority: 2,
        };
      },
    };
  }

  static importJSON(serializedNode: SerializedLayoutItemNode): LayoutItemNode {
    return $createLayoutItemNode().updateFromJSON(serializedNode);
  }

  isShadowRoot(): boolean {
    return true;
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
