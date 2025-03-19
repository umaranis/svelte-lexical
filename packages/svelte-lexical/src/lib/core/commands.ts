import type {ImagePayload} from './plugins/Image/ImageNode.js';
import {INSERT_IMAGE_COMMAND} from './plugins/Image/ImagePlugin.svelte';
import {$createCodeNode} from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import {$isDecoratorBlockNode} from './plugins/DecoratorBlockNode.js';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  type HeadingTagType,
} from '@lexical/rich-text';
import {$setBlocksType} from '@lexical/selection';
import {$isTableSelection} from '@lexical/table';
import {$getNearestBlockElementAncestorOrThrow} from '@lexical/utils';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  type LexicalEditor,
} from 'lexical';

import {TOGGLE_LINK_COMMAND} from '@lexical/link';
import {sanitizeUrl} from './plugins/link/url.js';

export const formatParagraph = (editor: LexicalEditor) => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    $setBlocksType(selection, () => $createParagraphNode());
  }
};

export const formatHeading = (
  editor: LexicalEditor,
  blockType: string,
  headingSize: HeadingTagType,
) => {
  if (blockType !== headingSize) {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createHeadingNode(headingSize));
    });
  }
};

export const formatBulletList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'bullet') {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatCheckList = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'check') {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatNumberedList = (
  editor: LexicalEditor,
  blockType: string,
) => {
  if (blockType !== 'number') {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  } else {
    formatParagraph(editor);
  }
};

export const formatQuote = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'quote') {
    editor.update(() => {
      const selection = $getSelection();
      $setBlocksType(selection, () => $createQuoteNode());
    });
  }
};

export const formatCode = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'code') {
    editor.update(() => {
      let selection = $getSelection();
      if (!selection) {
        return;
      }
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        $setBlocksType(selection, () => $createCodeNode());
      } else {
        const textContent = selection.getTextContent();
        const codeNode = $createCodeNode();
        selection.insertNodes([codeNode]);
        selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertRawText(textContent);
        }
      }
    });
  }
};

export const clearFormatting = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;
      const nodes = selection.getNodes();
      const extractedNodes = selection.extract();

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return;
      }

      nodes.forEach((node, idx) => {
        // We split the first and last node by the selection
        // So that we don't format unselected text inside those nodes
        if ($isTextNode(node)) {
          // Use a separate variable to ensure TS does not lose the refinement
          let textNode = node;
          if (idx === 0 && anchor.offset !== 0) {
            textNode = textNode.splitText(anchor.offset)[1] || textNode;
          }
          if (idx === nodes.length - 1) {
            textNode = textNode.splitText(focus.offset)[0] || textNode;
          }
          /**
           * If the selected text has one format applied
           * selecting a portion of the text, could
           * clear the format to the wrong portion of the text.
           *
           * The cleared text is based on the length of the selected text.
           */
          // We need this in case the selected text only has one format
          const extractedTextNode = extractedNodes[0];
          if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
            textNode = extractedTextNode;
          }

          if (textNode.__style !== '') {
            textNode.setStyle('');
          }
          if (textNode.__format !== 0) {
            textNode.setFormat(0);
            $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
          }
          node = textNode;
        } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
          node.replace($createParagraphNode(), true);
        } else if ($isDecoratorBlockNode(node)) {
          node.setFormat('');
        }
      });
    }
  });
};

export function InsertLink(editor: LexicalEditor, isLink: boolean) {
  if (!isLink) {
    return editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
  } else {
    return editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }
}

export function InsertImage(editor: LexicalEditor, payload: ImagePayload) {
  editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
}

export function FocusEditor(
  editor: LexicalEditor,
  defaultSelection: 'rootStart' | 'rootEnd' | undefined = undefined,
) {
  editor.focus(
    () => {
      // If we try and move selection to the same point with setBaseAndExtent, it won't
      // trigger a re-focus on the element. So in the case this occurs, we'll need to correct it.
      // Normally this is fine, Selection API !== Focus API, but fore the intents of the naming
      // of this plugin, which should preserve focus too.
      const activeElement = document.activeElement;
      const rootElement = editor.getRootElement() as HTMLDivElement;
      if (
        rootElement !== null &&
        (activeElement === null || !rootElement.contains(activeElement))
      ) {
        // Note: preventScroll won't work in Webkit.
        rootElement.focus({preventScroll: true});
      }
    },
    {defaultSelection},
  );
}
