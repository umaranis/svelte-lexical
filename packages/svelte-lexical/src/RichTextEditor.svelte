<script>
  import {
    createEditor,
    $getRoot as getRoot,
    $createParagraphNode as createParagraphNode,
    $createTextNode as createTextNode,
    ElementNode,
    TextNode,
  } from "lexical";
  import { registerRichText } from "@lexical/rich-text";
  import { HeadingNode, QuoteNode } from "@lexical/rich-text";
  import {
    ListItemNode,
    ListNode,
    insertList,
  } from "@lexical/list";
  import { onMount } from "svelte";
  import { CodeHighlightNode, CodeNode } from "@lexical/code";
  import { HashtagNode } from "@lexical/hashtag";
  import {
    TableCellNode,
    TableNode,
    TableRowNode,
    INSERT_TABLE_COMMAND,
  } from "@lexical/table";
  import { AutoLinkNode, LinkNode } from "@lexical/link";
  import { OverflowNode } from "@lexical/overflow";
  import {registerListCommands} from './utils/registerListCommands.js';
  import {registerTableCommands} from './utils/registerTableCommands.js';
  import { setContext } from 'svelte';

  let contentEditableElement;
  export let theme;

  const config = {
    theme: theme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      HashtagNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      OverflowNode,
    ],    
  };

  const editor = createEditor(config);
  setContext('editor', editor);

  registerListCommands(editor);
  registerTableCommands(editor);
  onMount(() => {
    editor.setRootElement(contentEditableElement);

    registerRichText(editor);
  });

</script>

<div class="editor-shell">
  <slot name="toolbar"></slot>
  <slot></slot>
  <div class="editor-container">
    <div
      contenteditable="true"
      bind:this={contentEditableElement}
      class="ContentEditable__root"
    />
    <div class="actions" />
  </div>
</div>

<style>
  .ContentEditable__root {
    min-height: 150px;
    border: 0;
    resize: none;
    cursor: text;
    font-size: 15px;
    caret-color: rgb(5, 5, 5);
    display: block;
    position: relative;
    tab-size: 1;
    outline: 0;
    padding: 10px;
    overflow: auto;
    resize: vertical;
    text-align: left;
  }
</style>
