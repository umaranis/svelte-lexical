import type {LexicalEditor} from 'lexical';
import {
  $getSelection as getSelection,
  $isRangeSelection as isRangeSelection,
  $isNodeSelection as isNodeSelection,
  $isRootOrShadowRoot as isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
  type LexicalNode,
} from 'lexical';
import {
  $isParentElementRTL as isParentElementRTL,
  $getSelectionStyleValueForProperty as getSelectionStyleValueForProperty,
} from '@lexical/selection';
import {$isHeadingNode as isHeadingNode} from '@lexical/rich-text';
import {ListNode, $isListNode as isListNode} from '@lexical/list';
import {
  $findMatchingParent as findMatchingParent,
  $getNearestNodeOfType as getNearestNodeOfType,
  mergeRegister,
  $isEditorIsNestedEditor as isEditorIsNestedEditor,
} from '@lexical/utils';
import {$isCodeNode as isCodeNode, CODE_LANGUAGE_MAP} from '@lexical/code';

import getSelectedNode from './getSelectionInfo.js';
import {$isLinkNode as isLinkNode} from '@lexical/link';
import {blockTypeToBlockName} from './ToolbarData.js';
import {$isTableSelection as isTableSelection} from '@lexical/table';

/**
 * ReactiveEditorState is a class which provides reactive state for lexical editor.
 * The editor state includes activeEditor, isBold, fontSize etc.
 *
 * call `activate()` to start listening to editor state changes.
 * `activate()` returns a cleanup function to stop listening to editor state changes.
 * This help integrates with Component lifecycle (onMount and onDestroy)
 */
export class ReactiveEditorState {
  editor: LexicalEditor;
  #activeEditor: LexicalEditor;

  constructor(editor: LexicalEditor) {
    this.editor = editor;
    this.#activeEditor = $state.raw(editor);
  }

  #isBold = $state.raw(false);
  #isItalic = $state.raw(false);
  #isUnderline = $state.raw(false);
  #isStrikethrough = $state.raw(false);
  #isSubscript = $state.raw(false);
  #isSuperscript = $state.raw(false);
  #isCode = $state.raw(false);
  #blockType = $state.raw('paragraph');
  #selectedElementKey = $state.raw<string | null>(null);
  #fontSize = $state.raw('15px');
  #fontFamily = $state.raw('Arial');
  #fontColor = $state.raw('#000');
  #bgColor = $state.raw('#fff');
  #isRTL = $state.raw(false);
  #codeLanguage = $state.raw('');
  #isLink = $state.raw(false);
  #isImageCaption = $state.raw(false);

  /**
   * Reactive state for active editor.
   */
  get activeEditor() {
    return this.#activeEditor;
  }

  /**
   * Reactive state for bold.
   */
  get isBold() {
    return this.#isBold;
  }

  /**
   * Reactive state for italic.
   */
  get isItalic() {
    return this.#isItalic;
  }

  /**
   * Reactive state for underline.
   */
  get isUnderline() {
    return this.#isUnderline;
  }

  /**
   * Reactive state for strikethrough.
   */
  get isStrikethrough() {
    return this.#isStrikethrough;
  }

  /**
   * Reactive state for subscript.
   */
  get isSubscript() {
    return this.#isSubscript;
  }

  /**
   * Reactive state for superscript.
   */
  get isSuperscript() {
    return this.#isSuperscript;
  }

  /**
   * Reactive state for code.
   */
  get isCode() {
    return this.#isCode;
  }

  /**
   * Reactive state for block type.
   */
  get blockType() {
    return this.#blockType;
  }

  /**
   * Reactive state for selected element key.
   */
  get selectedElementKey() {
    return this.#selectedElementKey;
  }

  /**
   * Reactive state for font size.
   */
  get fontSize() {
    return this.#fontSize;
  }

  /**
   * Reactive state for font family.
   */
  get fontFamily() {
    return this.#fontFamily;
  }

  /**
   * Reactive state for font color.
   */
  get fontColor() {
    return this.#fontColor;
  }

  /**
   * Reactive state for background color.
   */
  get bgColor() {
    return this.#bgColor;
  }

  /**
   * Reactive state for right to left.
   */
  get isRTL() {
    return this.#isRTL;
  }

  /**
   * Reactive state for code language.
   */
  get codeLanguage() {
    return this.#codeLanguage;
  }

  /**
   * Reactive state for link.
   */
  get isLink() {
    return this.#isLink;
  }

  /**
   * Reactive state for image caption.
   */
  get isImageCaption() {
    return this.#isImageCaption;
  }

  // #region : update reactive state through lexical editor events

  /**
   * update reactive state based on current editor state
   */
  private updateToolbar() {
    const selection = getSelection();
    if (isRangeSelection(selection)) {
      if (
        this.#activeEditor !== this.editor &&
        isEditorIsNestedEditor(this.#activeEditor)
      ) {
        const rootElement = this.#activeEditor.getRootElement();
        this.#isImageCaption = !!rootElement?.parentElement?.classList.contains(
          'image-caption-container',
        );
      } else {
        this.#isImageCaption = false;
      }
      const anchorNode = selection.anchor.getNode();
      const element = this.findTopLevelElement(anchorNode);
      const elementKey = element.getKey();
      const elementDOM = this.#activeEditor.getElementByKey(elementKey);
      this.#isRTL = isParentElementRTL(selection);
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if (isLinkNode(parent) || isLinkNode(node)) {
        this.#isLink = true;
      } else {
        this.#isLink = false;
      }
      if (elementDOM !== null) {
        this.#selectedElementKey = elementKey;
        if (isListNode(element)) {
          const parentList = getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          this.#blockType = type;
        } else {
          this.handleHeadingNode(element);
          this.handleCodeNode(element);
        }
      }
      this.#fontColor = getSelectionStyleValueForProperty(
        selection,
        'color',
        '#000',
      );
      this.#bgColor = getSelectionStyleValueForProperty(
        selection,
        'background-color',
        '#fff',
      );
      this.#fontFamily = getSelectionStyleValueForProperty(
        selection,
        'font-family',
        'Arial',
      );
    }
    if (isRangeSelection(selection) || isTableSelection(selection)) {
      this.#isBold = selection.hasFormat('bold');
      this.#isItalic = selection.hasFormat('italic');
      this.#isUnderline = selection.hasFormat('underline');
      this.#isStrikethrough = selection.hasFormat('strikethrough');
      this.#isSubscript = selection.hasFormat('subscript');
      this.#isSuperscript = selection.hasFormat('superscript');
      this.#isCode = selection.hasFormat('code');
      this.#fontSize = getSelectionStyleValueForProperty(
        selection,
        'font-size',
        '15px',
      );
    }
    if (isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      for (const selectedNode of nodes) {
        const parentList = getNearestNodeOfType(selectedNode, ListNode);
        if (parentList) {
          const type = parentList.getListType();
          this.#blockType = type;
        } else {
          const selectedElement = this.findTopLevelElement(selectedNode);
          this.handleHeadingNode(selectedElement);
          this.handleCodeNode(selectedElement);
        }
      }
    }
  }

  /**
   * start listening to editor state changes.
   * returns a cleanup function to stop listening to editor state changes.
   */
  public activate() {
    return mergeRegister(
      this.editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          this.updateToolbar();
        });
      }),
      this.editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          this.#activeEditor = newEditor;
          this.updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }

  private findTopLevelElement(node: LexicalNode) {
    let topLevelElement =
      node.getKey() === 'root'
        ? node
        : findMatchingParent(node, (e) => {
            const parent = e.getParent();
            return parent !== null && isRootOrShadowRoot(parent);
          });

    if (topLevelElement === null) {
      topLevelElement = node.getTopLevelElementOrThrow();
    }
    return topLevelElement;
  }

  private handleHeadingNode(selectedElement: LexicalNode) {
    const type = isHeadingNode(selectedElement)
      ? selectedElement.getTag()
      : selectedElement.getType();
    if (type in blockTypeToBlockName) {
      this.#blockType = type as keyof typeof blockTypeToBlockName;
    }
  }

  private handleCodeNode(element: LexicalNode) {
    if (isCodeNode(element)) {
      const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
      this.#codeLanguage = language
        ? CODE_LANGUAGE_MAP[language] || language
        : '';
      return;
    }
  }

  // #endregion: update reactive state through lexical editor events
}
