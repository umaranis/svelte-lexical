<script lang="ts">
  import type {ElementFormatType, NodeKey} from 'lexical';

  import {$isDecoratorBlockNode as isDecoratorBlockNode} from './DecoratorBlockNode.js';
  import {
    $getNearestBlockElementAncestorOrThrow as getNearestBlockElementAncestorOrThrow,
    mergeRegister,
  } from '@lexical/utils';
  import {
    $getNodeByKey as getNodeByKey,
    $getSelection as getSelection,
    $isNodeSelection as isNodeSelection,
    $isRangeSelection as isRangeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    FORMAT_ELEMENT_COMMAND,
  } from 'lexical';
  import type {Snippet} from 'svelte';
  import {getEditor} from '../composerContext.js';
  import {
    clearSelection,
    createNodeSelectionStore,
  } from '../nodeSelectionStore.js';

  type Props = Readonly<{
    children: Snippet;
    format?: ElementFormatType | null;
    nodeKey: NodeKey;
    className: Readonly<{
      base: string;
      focus: string;
    }>;
  }>;

  let {children, format, nodeKey, className}: Props = $props();
  const editor = getEditor();

  let isSelected = createNodeSelectionStore(editor, nodeKey);
  let ref: HTMLDivElement;

  $effect(() => {
    return mergeRegister(
      editor.registerCommand<ElementFormatType>(
        FORMAT_ELEMENT_COMMAND,
        (formatType) => {
          if ($isSelected) {
            const selection = getSelection();

            if (isNodeSelection(selection)) {
              const node = getNodeByKey(nodeKey);

              if (isDecoratorBlockNode(node)) {
                node.setFormat(formatType);
              }
            } else if (isRangeSelection(selection)) {
              const nodes = selection.getNodes();

              for (const node of nodes) {
                if (isDecoratorBlockNode(node)) {
                  node.setFormat(formatType);
                } else {
                  const element = getNearestBlockElementAncestorOrThrow(node);
                  element.setFormat(formatType);
                }
              }
            }

            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event) => {
          if (event.target === ref) {
            event.preventDefault();
            if (!event.shiftKey) {
              clearSelection(editor);
            }

            $isSelected = !$isSelected;
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  });
</script>

<div
  class={[className.base, $isSelected ? className.focus : null]
    .filter(Boolean)
    .join(' ')}
  bind:this={ref}
  style={`text-align: ${format ? format : ''};`}>
  {@render children()}
</div>
