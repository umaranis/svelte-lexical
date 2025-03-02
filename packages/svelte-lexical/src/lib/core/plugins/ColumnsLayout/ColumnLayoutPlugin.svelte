<script lang="ts">
  import type {ElementNode, LexicalNode} from 'lexical';

  import {getEditor} from '../../composerContext.js';

  import {
    $findMatchingParent as findMatchingParent,
    $insertNodeToNearestRoot as insertNodeToNearestRoot,
    mergeRegister,
  } from '@lexical/utils';
  import {
    $createParagraphNode as createParagraphNode,
    $getNodeByKey as getNodeByKey,
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_LOW,
    KEY_ARROW_DOWN_COMMAND,
    KEY_ARROW_LEFT_COMMAND,
    KEY_ARROW_RIGHT_COMMAND,
    KEY_ARROW_UP_COMMAND,
  } from 'lexical';
  import {onMount} from 'svelte';

  import {
    $createLayoutContainerNode as createLayoutContainerNode,
    $isLayoutContainerNode as isLayoutContainerNode,
    LayoutContainerNode,
  } from './LayoutContainerNode.js';
  import {
    $createLayoutItemNode as createLayoutItemNode,
    $isLayoutItemNode as isLayoutItemNode,
    LayoutItemNode,
    INSERT_LAYOUT_COMMAND,
    UPDATE_LAYOUT_COMMAND,
  } from './LayoutItemNode.js';

  const editor = getEditor();

  onMount(() => {
    if (!editor.hasNodes([LayoutContainerNode, LayoutItemNode])) {
      throw new Error(
        'LayoutPlugin: LayoutContainerNode, or LayoutItemNode not registered on editor',
      );
    }

    const $onEscape = (before: boolean) => {
      const selection = getSelection();
      if (
        isRangeSelection(selection) &&
        selection.isCollapsed() &&
        selection.anchor.offset === 0
      ) {
        const container = findMatchingParent(
          selection.anchor.getNode(),
          isLayoutContainerNode,
        );

        if (isLayoutContainerNode(container)) {
          const parent = container.getParent<ElementNode>();
          const child =
            parent &&
            (before
              ? parent.getFirstChild<LexicalNode>()
              : parent?.getLastChild<LexicalNode>());
          const descendant = before
            ? container.getFirstDescendant<LexicalNode>()?.getKey()
            : container.getLastDescendant<LexicalNode>()?.getKey();

          if (
            parent !== null &&
            child === container &&
            selection.anchor.key === descendant
          ) {
            if (before) {
              container.insertBefore(createParagraphNode());
            } else {
              container.insertAfter(createParagraphNode());
            }
          }
        }
      }

      return false;
    };

    const fillLayoutItemIfEmpty = (node: LayoutItemNode) => {
      if (node.isEmpty()) {
        node.append(createParagraphNode());
      }
    };

    const removeIsolatedLayoutItem = (node: LayoutItemNode): boolean => {
      const parent = node.getParent<ElementNode>();
      if (!isLayoutContainerNode(parent)) {
        const children = node.getChildren<LexicalNode>();
        for (const child of children) {
          node.insertBefore(child);
        }
        node.remove();
        return true;
      }
      return false;
    };

    return mergeRegister(
      // When layout is the last child pressing down/right arrow will insert paragraph
      // below it to allow adding more content. It's similar what $insertBlockNode
      // (mainly for decorators), except it'll always be possible to continue adding
      // new content even if trailing paragraph is accidentally deleted
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        () => $onEscape(false),
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_RIGHT_COMMAND,
        () => $onEscape(false),
        COMMAND_PRIORITY_LOW,
      ),
      // When layout is the first child pressing up/left arrow will insert paragraph
      // above it to allow adding more content. It's similar what $insertBlockNode
      // (mainly for decorators), except it'll always be possible to continue adding
      // new content even if leading paragraph is accidentally deleted
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        () => $onEscape(true),
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        () => $onEscape(true),
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_LAYOUT_COMMAND,
        (template: string) => {
          editor.update(() => {
            const container = createLayoutContainerNode(template);
            const itemsCount = getItemsCountFromTemplate(template);

            for (let i = 0; i < itemsCount; i++) {
              container.append(
                createLayoutItemNode().append(createParagraphNode()),
              );
            }

            insertNodeToNearestRoot(container);
            container.selectStart();
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        UPDATE_LAYOUT_COMMAND,
        ({template, nodeKey}) => {
          editor.update(() => {
            const container = getNodeByKey<LexicalNode>(nodeKey);

            if (!isLayoutContainerNode(container)) {
              return;
            }

            const itemsCount = getItemsCountFromTemplate(template);
            const prevItemsCount = getItemsCountFromTemplate(
              container.getTemplateColumns(),
            );

            // Add or remove extra columns if new template does not match existing one
            if (itemsCount > prevItemsCount) {
              for (let i = prevItemsCount; i < itemsCount; i++) {
                container.append(
                  createLayoutItemNode().append(createParagraphNode()),
                );
              }
            } else if (itemsCount < prevItemsCount) {
              for (let i = prevItemsCount - 1; i >= itemsCount; i--) {
                const layoutItem = container.getChildAtIndex<LexicalNode>(i);

                if (isLayoutItemNode(layoutItem)) {
                  layoutItem.remove();
                }
              }
            }

            container.setTemplateColumns(template);
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),

      editor.registerNodeTransform(LayoutItemNode, (node) => {
        // Structure enforcing transformers for each node type. In case nesting structure is not
        // "Container > Item" it'll unwrap nodes and convert it back
        // to regular content.
        const isRemoved = removeIsolatedLayoutItem(node);

        if (!isRemoved) {
          // Layout item should always have a child. this function will listen
          // for any empty layout item and fill it with a paragraph node
          fillLayoutItemIfEmpty(node);
        }
      }),
      editor.registerNodeTransform(LayoutContainerNode, (node) => {
        const children = node.getChildren<LexicalNode>();
        if (!children.every(isLayoutItemNode)) {
          for (const child of children) {
            node.insertBefore(child);
          }
          node.remove();
        }
      }),
    );
  });

  function getItemsCountFromTemplate(template: string): number {
    return template.trim().split(/\s+/).length;
  }
</script>
