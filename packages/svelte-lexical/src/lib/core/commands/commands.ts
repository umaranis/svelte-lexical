import type {ImagePayload} from '../plugins/Image/ImageNode.js';
import {INSERT_IMAGE_COMMAND} from '../plugins/Image/ImagePlugin.svelte';
import {$createCodeNode} from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import {$isDecoratorBlockNode} from '../plugins/DecoratorBlockNode.js';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  type HeadingTagType,
} from '@lexical/rich-text';
import {$setBlocksType} from '@lexical/selection';
import {$isTableSelection, INSERT_TABLE_COMMAND} from '@lexical/table';
import {$getNearestBlockElementAncestorOrThrow} from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $isElementNode,
  $isLineBreakNode,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  $splitNode,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  type ElementNode,
  type LexicalEditor,
  type LexicalNode,
  type RangeSelection,
} from 'lexical';

import {TOGGLE_LINK_COMMAND} from '@lexical/link';
import {sanitizeUrl} from '../plugins/link/url.js';
import {
  INSERT_BLUESKY_COMMAND,
  type BlueskyPayload,
} from '../plugins/bluesky/BlueskyPlugin.svelte';
import {INSERT_LAYOUT_COMMAND} from '../plugins/ColumnsLayout/LayoutItemNode.js';
import {INSERT_TWEET_COMMAND} from '../plugins/twitter/TwitterPlugin.svelte';
import {INSERT_YOUTUBE_COMMAND} from '../plugins/youtube/YoutubePlugin.svelte';

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createParagraphNode());
    }
  });
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

function $splitParagraphsByLineBreaks(selection: RangeSelection): void {
  const blocks: Set<ElementNode> = new Set();
  for (const node of selection.getNodes()) {
    const block = $isParagraphNode(node) ? node : $findParagraphParent(node);
    if (block !== null) {
      blocks.add(block);
    }
  }
  for (const point of [selection.anchor, selection.focus]) {
    const block = $findParagraphParent(point.getNode());
    if (block !== null) {
      blocks.add(block);
    }
  }

  const anchorKey = selection.anchor.key;
  const anchorOffset = selection.anchor.offset;
  const anchorType = selection.anchor.type;
  const focusKey = selection.focus.key;
  const focusOffset = selection.focus.offset;
  const focusType = selection.focus.type;

  for (const block of blocks) {
    const children = block.getChildren();
    const lbIndices: number[] = [];
    for (let i = 0; i < children.length; i++) {
      if ($isLineBreakNode(children[i])) {
        lbIndices.push(i);
      }
    }
    if (lbIndices.length === 0) {
      continue;
    }
    for (let j = lbIndices.length - 1; j >= 0; j--) {
      const [, rightBlock] = $splitNode(block, lbIndices[j]);
      const firstChild = rightBlock.getFirstChild();
      if ($isLineBreakNode(firstChild)) {
        firstChild.remove();
      }
    }
  }

  const newSelection = $createRangeSelection();
  newSelection.anchor.set(anchorKey, anchorOffset, anchorType);
  newSelection.focus.set(focusKey, focusOffset, focusType);
  $setSelection(newSelection);
}

function $findParagraphParent(node: LexicalNode): ElementNode | null {
  if ($isParagraphNode(node)) {
    return node;
  }
  const parent = node.getParent();
  return $isElementNode(parent) && $isParagraphNode(parent) ? parent : null;
}

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
        $splitParagraphsByLineBreaks(selection);
        selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }
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

export function toggleBold(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
}

export function toggleItalic(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
}

export function toggleStrikethrough(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
}

export function toggleUnderline(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
}

export function toggleSubscript(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
}

export function toggleSuperscript(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
}

export function undo(editor: LexicalEditor) {
  editor.dispatchCommand(UNDO_COMMAND, undefined);
}

export function redo(editor: LexicalEditor) {
  editor.dispatchCommand(REDO_COMMAND, undefined);
}

export const clearFormatting = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const anchor = selection.anchor;
      const focus = selection.focus;
      const extractedNodes = selection.extract();

      if (anchor.key === focus.key && anchor.offset === focus.offset) {
        return;
      }

      extractedNodes.forEach((node) => {
        if ($isTextNode(node)) {
          if (node.getStyle() !== '') {
            node.setStyle('');
          }
          if (node.getFormat() !== 0) {
            node.setFormat(0);
          }
          const nearestBlockElement =
            $getNearestBlockElementAncestorOrThrow(node);
          if (nearestBlockElement.getFormat() !== 0) {
            nearestBlockElement.setFormat('');
          }
          if (nearestBlockElement.getIndent() !== 0) {
            nearestBlockElement.setIndent(0);
          }
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

export function insertBlueskyPost(editor: LexicalEditor, post: BlueskyPayload) {
  editor.dispatchCommand(INSERT_BLUESKY_COMMAND, post);
}

export function insertColumnsLayout(editor: LexicalEditor, template: string) {
  editor.dispatchCommand(INSERT_LAYOUT_COMMAND, template);
}

export function insertTable(
  editor: LexicalEditor,
  columns: string,
  rows: string,
  includeHeaders: boolean = true,
) {
  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
    columns,
    rows,
    includeHeaders,
  });
}

export function insertTweet(editor: LexicalEditor, id: string) {
  editor.dispatchCommand(INSERT_TWEET_COMMAND, id);
}

export function insertYoutube(editor: LexicalEditor, id: string) {
  editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, id);
}
