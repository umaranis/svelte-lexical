import type {
  DOMConversionMap,
  DOMExportOutput,
  LexicalCommand,
  SerializedLexicalNode,
  LexicalNode,
  DOMConversionOutput,
  EditorConfig,
} from 'lexical';
import pkg, {$applyNodeReplacement, type LexicalEditor} from 'lexical';
import HorizontalRuleComponent from './HorizontalRuleComponent.svelte';

const {createCommand, DecoratorNode} = pkg;

export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> =
  createCommand();

export class HorizontalRuleNode extends DecoratorNode<unknown> {
  static getType(): string {
    return 'horizontalrule';
  }

  static clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key);
  }

  static importJSON(): HorizontalRuleNode {
    return $createHorizontalRuleNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: convertHorizontalRuleElement,
        priority: 0,
      }),
    };
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: 'horizontalrule',
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    return {element: document.createElement('hr')};
  }

  createDOM(editorConfig: EditorConfig, editor: LexicalEditor): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'contents';

    new HorizontalRuleComponent({
      target: div,
      props: {
        nodeKey: this.__key,
        editor,
      },
    });

    return div;
  }

  getTextContent(): '\n' {
    return '\n';
  }

  isInline(): false {
    return false;
  }

  updateDOM(): false {
    return false;
  }

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
