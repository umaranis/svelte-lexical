<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import {signal} from '@lexical/extension';
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
    /**
     * When `true` (default `false`), nested tables will be allowed.
     *
     * @experimental Nested tables are not officially supported.
     */
    hasNestedTables?: boolean;
    /**
     * When `true` (default `false`), nested tables will be resized to fit the width of the parent table cell.
     *
     * @experimental Nested tables are not officially supported.
     */
    hasFitNestedTables?: boolean;
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
    hasNestedTables = false,
    hasFitNestedTables = false,
  }: TablePluginProps = $props();

  const editor = getEditor();

  $effect(() => {
    setScrollableTablesActive(editor, hasHorizontalScroll);
  });

  const hasNestedTablesSignal = signal(false);
  $effect.pre(() => {
    hasNestedTablesSignal.value = hasNestedTables;
  });

  const hasFitNestedTablesSignal = signal(false);
  $effect.pre(() => {
    hasFitNestedTablesSignal.value = hasFitNestedTables;
  });

  $effect(() =>
    registerTablePlugin(editor, {
      hasFitNestedTables: hasFitNestedTablesSignal,
      hasNestedTables: hasNestedTablesSignal,
    }),
  );

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
