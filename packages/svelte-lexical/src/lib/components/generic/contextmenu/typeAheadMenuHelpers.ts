import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  createCommand,
  getDOMSelection,
  TextNode,
  type CommandListenerPriority,
  type LexicalCommand,
  type LexicalEditor,
  type RangeSelection,
} from 'lexical';
import type {
  MenuOption,
  MenuRenderFn,
  MenuResolution,
  TriggerFn,
} from './contextMenuHelpers.js';

export const SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND: LexicalCommand<{
  index: number;
  option: MenuOption;
}> = createCommand('SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND');

export type TypeaheadMenuPluginProps<TOption extends MenuOption> = {
  onQueryChange: (matchingString: string | null) => void;
  onSelectOption: (
    option: TOption,
    textNodeContainingQuery: TextNode | null,
    closeMenu: () => void,
    matchingString: string,
  ) => void;
  options: Array<TOption>;
  menuRenderFn: MenuRenderFn<TOption>;
  triggerFn: TriggerFn;
  onOpen?: (resolution: MenuResolution) => void;
  onClose?: () => void;
  anchorClassName?: string;
  commandPriority?: CommandListenerPriority;
  parent?: HTMLElement;
  preselectFirstItem?: boolean;
  ignoreEntityBoundary?: boolean;
};

function getTextUpToAnchor(selection: RangeSelection): string | null {
  const anchor = selection.anchor;
  if (anchor.type !== 'text') {
    return null;
  }
  const anchorNode = anchor.getNode();
  if (!anchorNode.isSimpleText()) {
    return null;
  }
  const anchorOffset = anchor.offset;
  return anchorNode.getTextContent().slice(0, anchorOffset);
}

export function getQueryTextForSearch(editor: LexicalEditor): string | null {
  let text = null;
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    text = getTextUpToAnchor(selection);
  });
  return text;
}

export function isSelectionOnEntityBoundary(
  editor: LexicalEditor,
  offset: number,
): boolean {
  if (offset !== 0) {
    return false;
  }
  return editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();
      const prevSibling = anchorNode.getPreviousSibling();
      return $isTextNode(prevSibling) && prevSibling.isTextEntity();
    }
    return false;
  });
}

export function tryToPositionRange(
  leadOffset: number,
  range: Range,
  editorWindow: Window,
): boolean {
  const domSelection = getDOMSelection(editorWindow);
  if (domSelection === null || !domSelection.isCollapsed) {
    return false;
  }
  const anchorNode = domSelection.anchorNode;
  const startOffset = leadOffset;
  const endOffset = domSelection.anchorOffset;

  if (anchorNode == null || endOffset == null) {
    return false;
  }

  try {
    range.setStart(anchorNode, startOffset);
    range.setEnd(anchorNode, endOffset);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return false;
  }

  return true;
}

export function setContainerDivAttributes(
  containerDiv: HTMLElement,
  className?: string,
) {
  if (className != null) {
    containerDiv.className = className;
  }
  containerDiv.setAttribute('aria-label', 'Typeahead menu');
  containerDiv.setAttribute('role', 'listbox');
  containerDiv.style.display = 'block';
  containerDiv.style.position = 'absolute';
}

// Got from https://stackoverflow.com/a/42543908/2013580
export function getScrollParent(
  element: HTMLElement,
  includeHidden: boolean,
): HTMLElement | HTMLBodyElement {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = includeHidden
    ? /(auto|scroll|hidden)/
    : /(auto|scroll)/;
  if (style.position === 'fixed') {
    return document.body;
  }
  for (
    let parent: HTMLElement | null = element;
    (parent = parent.parentElement);

  ) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (
      overflowRegex.test(style.overflow + style.overflowY + style.overflowX)
    ) {
      return parent;
    }
  }
  return document.body;
}

export function isTriggerVisibleInNearestScrollContainer(
  targetElement: HTMLElement,
  containerElement: HTMLElement,
): boolean {
  const tRect = targetElement.getBoundingClientRect();
  const cRect = containerElement.getBoundingClientRect();
  return tRect.top > cRect.top && tRect.top < cRect.bottom;
}
