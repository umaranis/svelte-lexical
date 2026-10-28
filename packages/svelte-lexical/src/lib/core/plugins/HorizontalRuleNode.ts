import type {
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  LexicalEditor,
} from 'lexical';
import {
  $isHorizontalRuleNode,
  HorizontalRuleNode as BaseHorizontalRuleNode,
  INSERT_HORIZONTAL_RULE_COMMAND,
  type SerializedHorizontalRuleNode,
} from '@lexical/extension';
import {$applyNodeReplacement} from 'lexical';
import HorizontalRuleComponent from './HorizontalRuleComponent.svelte';
import {mount} from 'svelte';

export {
  $isHorizontalRuleNode,
  INSERT_HORIZONTAL_RULE_COMMAND,
  type SerializedHorizontalRuleNode,
};

export class HorizontalRuleNode extends BaseHorizontalRuleNode {
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

  createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
    const hr = super.createDOM(config);

    mount(HorizontalRuleComponent, {
      target: hr,
      props: {
        nodeKey: this.__key,
        editor: editor!,
        self: hr,
      },
    });

    return hr;
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
