<script lang="ts">
  import {onMount} from 'svelte';
  import {ImageNode} from '../Image/ImageNode.js';
  import {
    registerMarkdownShortcuts,
    type ElementTransformer,
  } from '@lexical/markdown';
  import {
    CHECK_LIST,
    ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
    TEXT_MATCH_TRANSFORMERS,
    type TextMatchTransformer,
    type Transformer,
  } from '@lexical/markdown';
  import {
    $createImageNode as createImageNode,
    $isImageNode as isImageNode,
  } from '../Image/ImageNode.js';
  import {
    $isHorizontalRuleNode as isHorizontalRuleNode,
    HorizontalRuleNode,
    $createHorizontalRuleNode as createHorizontalRuleNode,
  } from '../HorizontalRuleNode.js';
  import type {LexicalNode} from 'lexical';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();

  const HR: ElementTransformer = {
    dependencies: [HorizontalRuleNode],
    export: (node: LexicalNode) => {
      return isHorizontalRuleNode(node) ? '***' : null;
    },
    regExp: /^(---|\*\*\*|___)\s?$/,
    replace: (parentNode, _1, _2, isImport) => {
      const line = createHorizontalRuleNode();

      // TODO: Get rid of isImport flag
      if (isImport || parentNode.getNextSibling() != null) {
        parentNode.replace(line);
      } else {
        parentNode.insertBefore(line);
      }

      line.selectNext();
    },
    type: 'element',
  };

  export const IMAGE: TextMatchTransformer = {
    dependencies: [ImageNode],
    export: (node) => {
      if (!isImageNode(node)) {
        return null;
      }

      return `![${node.getAltText()}](${node.getSrc()})`;
    },
    importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
    regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
    replace: (textNode, match) => {
      const [, altText, src] = match;
      const imageNode = createImageNode({
        altText,
        maxWidth: 800,
        src,
      });
      textNode.replace(imageNode);
    },
    trigger: ')',
    type: 'text-match',
  };

  const TRANSFORMERS: Array<Transformer> = [
    HR,
    IMAGE,
    CHECK_LIST,
    ...ELEMENT_TRANSFORMERS,
    ...TEXT_FORMAT_TRANSFORMERS,
    ...TEXT_MATCH_TRANSFORMERS,
  ];

  onMount(() => {
    return registerMarkdownShortcuts(editor, TRANSFORMERS);
  });
</script>
