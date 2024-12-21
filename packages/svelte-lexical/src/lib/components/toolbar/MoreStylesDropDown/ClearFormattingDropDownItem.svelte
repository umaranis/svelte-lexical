<script lang="ts">
  import DropDownItem from '$lib/components/generic/dropdown/DropDownItem.svelte';
  import {getActiveEditor} from '$lib/core/composerContext.js';
  import {$isDecoratorBlockNode as isDecoratorBlockNode} from '$lib/core/plugins/DecoratorBlockNode.js';
  import {
    $isQuoteNode as isQuoteNode,
    $isHeadingNode as isHeadingNode,
  } from '@lexical/rich-text';
  import {$isTableSelection as isTableSelection} from '@lexical/table';
  import {$getNearestBlockElementAncestorOrThrow as getNearestBlockElementAncestorOrThrow} from '@lexical/utils';
  import {
    $isTextNode as isTextNode,
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    $createParagraphNode as createParagraphNode,
  } from 'lexical';

  const activeEditor = getActiveEditor();

  function clearFormatting() {
    $activeEditor.update(() => {
      const selection = getSelection();
      if (isRangeSelection(selection) || isTableSelection(selection)) {
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
          if (isTextNode(node)) {
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
            if (nodes.length === 1 && isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }

            if (textNode.__style !== '') {
              textNode.setStyle('');
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
            }
            node = textNode;
          } else if (isHeadingNode(node) || isQuoteNode(node)) {
            node.replace(createParagraphNode(), true);
          } else if (isDecoratorBlockNode(node)) {
            node.setFormat('');
          }
        });
      }
    });
  }
</script>

<DropDownItem
  onclick={clearFormatting}
  class="item"
  title="Clear text formatting"
  ariaLabel="Clear all text formatting">
  <i class="icon clear"></i>
  <span class="text">Clear Formatting</span>
</DropDownItem>
