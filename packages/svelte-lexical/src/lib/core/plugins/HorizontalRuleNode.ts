import type {
  DOMConversionMap,
  DOMExportOutput,
  LexicalCommand,
  SerializedLexicalNode,
  LexicalNode,
  DOMConversionOutput,
  EditorConfig,
  LexicalEditor,
} from 'lexical';
import {createCommand, DecoratorNode, $applyNodeReplacement} from 'lexical';
import HorizontalRuleComponent from './HorizontalRuleComponent.svelte';
import {addClassNamesToElement} from '@lexical/utils';
import {mount} from 'svelte';

export type SerializedHorizontalRuleNode = SerializedLexicalNode;

export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> =
  createCommand('INSERT_HORIZONTAL_RULE_COMMAND');

export class HorizontalRuleNode extends DecoratorNode<unknown> {
  static getType(): string {
    return 'horizontalrule';
  }

  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key);
  }

  static importJSON(
    serializedNode: SerializedHorizontalRuleNode,
  ): HorizontalRuleNode {
    return $createHorizontalRuleNode().updateFromJSON(serializedNode);
  }

  static importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: convertHorizontalRuleElement,
        priority: 0,
      }),
    };
  }

  /**
   * It tells `Decorater.svelte` that this component doesn't need rendering during decorator listener call.
   * `this.decorate` should also return null when skipDecorateRender is true
   */
  static skipDecorateRender = true;

  exportDOM(): DOMExportOutput {
    return {element: document.createElement('hr')};
  }

  createDOM(config: EditorConfig, editor: LexicalEditor): HTMLElement {
    const hr = document.createElement('hr');
    addClassNamesToElement(hr, config.theme.hr);

    mount(HorizontalRuleComponent, {
      target: hr,
      props: {
        nodeKey: this.__key,
        editor,
        self: hr,
      },
    });

    return hr;
  }

  getTextContent(): string {
    return '\n';
  }

  isInline(): false {
    return false;
  }

  updateDOM(): boolean {
    return false;
  }

  /**
   * @returns should return null if not participating in decorator rendering (skipDecorateRender should also be true)
   */
  decorate() {
    return null;
  }
}

function convertHorizontalRuleElement(): DOMConversionOutput {
  return {node: $createHorizontalRuleNode()};
}

export function $createHorizontalRuleNode(): HorizontalRuleNode {
  return $applyNodeReplacement(new HorizontalRuleNode());
}

export function $isHorizontalRuleNode(
  node: LexicalNode | null | undefined,
): node is HorizontalRuleNode {
  return node instanceof HorizontalRuleNode;
}
