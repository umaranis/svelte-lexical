import { createCommand, DecoratorNode } from 'lexical';

/**
 * @constant { LexicalCommand }
 */
export const INSERT_HORIZONTAL_RULE_COMMAND = createCommand();

export class HorizontalRuleNode extends DecoratorNode {
  /**
   *
   * @returns {string}
   */
  static getType() {
    return 'horizontalrule';
  }

  /**
   *
   * @param {HorizontalRuleNode} node
   * @returns { HorizontalRuleNode}
   */
  static clone(node) {
    return new HorizontalRuleNode(node.__key);
  }

  /**
   * @returns {DOMConversionMap | null}
   */
  static importDOM() {
    return {
      hr: (node) => ({
        conversion: convertHorizontalRuleElement,
        priority: 0,
      }),
    };
  }

  /**
   * @returns { DOMExportOutput }
   */
  exportDOM() {
    return { element: document.createElement('hr') };
  }

  /**
   * @returns { HTMLElement }
   */
  createDOM() {
    const div = document.createElement('div');
    div.style.display = 'contents';
    div.appendChild(this.decorate());
    return div;
  }

  /**
   * @returns { '\n' }
   */
  getTextContent() {
    return '\n';
  }

  /**
   * @returns { true }
   */
  isTopLevel() {
    return true;
  }

  /**
   * @returns { false }
   */
  updateDOM() {
    return false;
  }

  decorate() {
    return document.createElement('hr');
  }
}

/**
 * @returns { DOMConversionOutput }
 */
function convertHorizontalRuleElement() {
  return { node: $createHorizontalRuleNode() };
}

/**
 * @returns { HorizontalRuleNode }
 */
export function $createHorizontalRuleNode() {
  return new HorizontalRuleNode();
}

/**
 * @param {?LexicalNode} node
 * @returns { LexicalNode }
 */
export function $isHorizontalRuleNode(node) {
  return node instanceof HorizontalRuleNode;
}
