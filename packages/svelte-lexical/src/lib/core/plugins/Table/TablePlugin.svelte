<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import {
    registerTableCellUnmergeTransform,
    registerTablePlugin,
    registerTableSelectionObserver,
    setScrollableTablesActive,
    TableCellNode,
  } from '@lexical/table';

  export interface TablePluginProps {
    /**
     * When `false` (default `true`), merged cell support (colspan and rowspan) will be disabled and all
     * tables will be forced into a regular grid with 1x1 table cells.
     */
    hasCellMerge?: boolean;
    /**
     * When `false` (default `true`), the background color of TableCellNode will always be removed.
     */
    hasCellBackgroundColor?: boolean;
    /**
     * When `true` (default `true`), the tab key can be used to navigate table cells.
     */
    hasTabHandler?: boolean;
    /**
     * When `true` (default `false`), tables will be wrapped in a `<div>` to enable horizontal scrolling
     */
    hasHorizontalScroll?: boolean;
  }

  /**
   * A plugin to enable all of the features of Lexical's TableNode.
   *
   * @param props - See type for documentation
   * @returns An element to render in your LexicalComposer
   */
  let {
    hasCellMerge = true,
    hasCellBackgroundColor = true,
    hasTabHandler = true,
    hasHorizontalScroll = false,
  }: TablePluginProps = $props();

  const editor = getEditor();

  $effect(() => {
    setScrollableTablesActive(editor, hasHorizontalScroll);
  });

  $effect(() => registerTablePlugin(editor));

  $effect(() => registerTableSelectionObserver(editor, hasTabHandler));

  // Unmerge cells when the feature isn't enabled
  $effect(() => {
    if (!hasCellMerge) {
      return registerTableCellUnmergeTransform(editor);
    }
  });

  // Remove cell background color when feature is disabled
  $effect(() => {
    if (hasCellBackgroundColor) {
      return;
    }
    return editor.registerNodeTransform(TableCellNode, (node) => {
      if (node.getBackgroundColor() !== null) {
        node.setBackgroundColor(null);
      }
    });
  });
</script>
