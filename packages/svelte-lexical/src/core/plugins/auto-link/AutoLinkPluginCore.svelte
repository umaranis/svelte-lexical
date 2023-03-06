<script lang="ts">
  import type {LinkAttributes} from '@lexical/link';
  import type {ElementNode, LexicalNode} from 'lexical';

  import {
    $createAutoLinkNode as createAutoLinkNode,
    $isAutoLinkNode as isAutoLinkNode,
    $isLinkNode as isLinkNode,
    AutoLinkNode,
  } from '@lexical/link';
  import {mergeRegister} from '@lexical/utils';
  import {
    $createTextNode as createTextNode,
    $isElementNode as isElementNode,
    $isLineBreakNode as isLineBreakNode,
    $isTextNode as isTextNode,
    TextNode,
  } from 'lexical';
  import {getEditor} from '../../svelteContext';
  import {onMount} from 'svelte';

  type ChangeHandler = (url: string | null, prevUrl: string | null) => void;

  type LinkMatcherResult = {
    attributes?: LinkAttributes;
    index: number;
    length: number;
    text: string;
    url: string;
  };

  type LinkMatcher = (text: string) => LinkMatcherResult | null;

  function findFirstMatch(
    text: string,
    matchers: Array<LinkMatcher>,
  ): LinkMatcherResult | null {
    for (let i = 0; i < matchers.length; i++) {
      const match = matchers[i](text);

      if (match) {
        return match;
      }
    }

    return null;
  }

  const PUNCTUATION_OR_SPACE = /[.,;\s]/;

  function isSeparator(char: string): boolean {
    return PUNCTUATION_OR_SPACE.test(char);
  }

  function endsWithSeparator(textContent: string): boolean {
    return isSeparator(textContent[textContent.length - 1]);
  }

  function startsWithSeparator(textContent: string): boolean {
    return isSeparator(textContent[0]);
  }

  function isPreviousNodeValid(node: LexicalNode): boolean {
    let previousNode = node.getPreviousSibling();
    if (isElementNode(previousNode)) {
      previousNode = previousNode.getLastDescendant();
    }
    return (
      previousNode === null ||
      isLineBreakNode(previousNode) ||
      (isTextNode(previousNode) &&
        endsWithSeparator(previousNode.getTextContent()))
    );
  }

  function isNextNodeValid(node: LexicalNode): boolean {
    let nextNode = node.getNextSibling();
    if (isElementNode(nextNode)) {
      nextNode = nextNode.getFirstDescendant();
    }
    return (
      nextNode === null ||
      isLineBreakNode(nextNode) ||
      (isTextNode(nextNode) && startsWithSeparator(nextNode.getTextContent()))
    );
  }

  function isContentAroundIsValid(
    matchStart: number,
    matchEnd: number,
    text: string,
    node: TextNode,
  ): boolean {
    const contentBeforeIsValid =
      matchStart > 0
        ? isSeparator(text[matchStart - 1])
        : isPreviousNodeValid(node);
    if (!contentBeforeIsValid) {
      return false;
    }

    const contentAfterIsValid =
      matchEnd < text.length
        ? isSeparator(text[matchEnd])
        : isNextNodeValid(node);
    return contentAfterIsValid;
  }

  function handleLinkCreation(
    node: TextNode,
    matchers: Array<LinkMatcher>,
    onChange: ChangeHandler,
  ): void {
    const nodeText = node.getTextContent();
    let text = nodeText;
    let invalidMatchEnd = 0;
    let remainingTextNode = node;
    let match;

    while ((match = findFirstMatch(text, matchers)) && match !== null) {
      const matchStart = match.index;
      const matchLength = match.length;
      const matchEnd = matchStart + matchLength;
      const isValid = isContentAroundIsValid(
        invalidMatchEnd + matchStart,
        invalidMatchEnd + matchEnd,
        nodeText,
        node,
      );

      if (isValid) {
        let linkTextNode;
        if (invalidMatchEnd + matchStart === 0) {
          [linkTextNode, remainingTextNode] = remainingTextNode.splitText(
            invalidMatchEnd + matchLength,
          );
        } else {
          [, linkTextNode, remainingTextNode] = remainingTextNode.splitText(
            invalidMatchEnd + matchStart,
            invalidMatchEnd + matchStart + matchLength,
          );
        }
        const linkNode = createAutoLinkNode(match.url, match.attributes);
        const textNode = createTextNode(match.text);
        textNode.setFormat(linkTextNode.getFormat());
        textNode.setDetail(linkTextNode.getDetail());
        linkNode.append(textNode);
        linkTextNode.replace(linkNode);
        onChange(match.url, null);
        invalidMatchEnd = 0;
      } else {
        invalidMatchEnd += matchEnd;
      }

      text = text.substring(matchEnd);
    }
  }

  function handleLinkEdit(
    linkNode: AutoLinkNode,
    matchers: Array<LinkMatcher>,
    onChange: ChangeHandler,
  ): void {
    // Check children are simple text
    const children = linkNode.getChildren();
    const childrenLength = children.length;
    for (let i = 0; i < childrenLength; i++) {
      const child = children[i];
      if (!isTextNode(child) || !child.isSimpleText()) {
        replaceWithChildren(linkNode);
        onChange(null, linkNode.getURL());
        return;
      }
    }

    // Check text content fully matches
    const text = linkNode.getTextContent();
    const match = findFirstMatch(text, matchers);
    if (match === null || match.text !== text) {
      replaceWithChildren(linkNode);
      onChange(null, linkNode.getURL());
      return;
    }

    // Check neighbors
    if (!isPreviousNodeValid(linkNode) || !isNextNodeValid(linkNode)) {
      replaceWithChildren(linkNode);
      onChange(null, linkNode.getURL());
      return;
    }

    const url = linkNode.getURL();
    if (url !== match.url) {
      linkNode.setURL(match.url);
      onChange(match.url, url);
    }

    if (match.attributes) {
      const rel = linkNode.getRel();
      if (rel !== match.attributes.rel) {
        linkNode.setRel(match.attributes.rel || null);
        onChange(match.attributes.rel || null, rel);
      }

      const target = linkNode.getTarget();
      if (target !== match.attributes.target) {
        linkNode.setTarget(match.attributes.target || null);
        onChange(match.attributes.target || null, target);
      }
    }
  }

  // Bad neighbours are edits in neighbor nodes that make AutoLinks incompatible.
  // Given the creation preconditions, these can only be simple text nodes.
  function handleBadNeighbors(
    textNode: TextNode,
    onChange: ChangeHandler,
  ): void {
    const previousSibling = textNode.getPreviousSibling();
    const nextSibling = textNode.getNextSibling();
    const text = textNode.getTextContent();

    if (isAutoLinkNode(previousSibling) && !startsWithSeparator(text)) {
      replaceWithChildren(previousSibling);
      onChange(null, previousSibling.getURL());
    }

    if (isAutoLinkNode(nextSibling) && !endsWithSeparator(text)) {
      replaceWithChildren(nextSibling);
      onChange(null, nextSibling.getURL());
    }
  }

  function replaceWithChildren(node: ElementNode): Array<LexicalNode> {
    const children = node.getChildren();
    const childrenLength = children.length;

    for (let j = childrenLength - 1; j >= 0; j--) {
      node.insertAfter(children[j]);
    }

    node.remove();
    return children.map((child) => child.getLatest());
  }

  const editor = getEditor();
  export let matchers: Array<LinkMatcher>;
  export let onChange: ChangeHandler | undefined = undefined;

  onMount(() => {
    if (!editor.hasNodes([AutoLinkNode])) {
      throw new Error('AutoLinkPlugin: AutoLinkNode not registered on editor');
    }

    const onChangeWrapped = (url: string | null, prevUrl: string | null) => {
      if (onChange) {
        onChange(url, prevUrl);
      }
    };

    return mergeRegister(
      editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
        const parent = textNode.getParentOrThrow();
        if (isAutoLinkNode(parent)) {
          handleLinkEdit(parent, matchers, onChangeWrapped);
        } else if (!isLinkNode(parent)) {
          if (textNode.isSimpleText()) {
            handleLinkCreation(textNode, matchers, onChangeWrapped);
          }

          handleBadNeighbors(textNode, onChangeWrapped);
        }
      }),
    );
  });
</script>
