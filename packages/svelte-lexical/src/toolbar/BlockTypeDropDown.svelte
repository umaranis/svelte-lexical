<script>
  import { afterUpdate, getContext, onMount, tick } from "svelte";

  import { blockType } from "./stores.js";
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    $createParagraphNode as createParagraphNode,
  } from "lexical";
  import { $wrapLeafNodesInElements as wrapLeafNodesInElements } from "@lexical/selection";
  import {
    $createHeadingNode as createHeadingNode,
    $createQuoteNode as createQuoteNode,
  } from "@lexical/rich-text";
  import { $createCodeNode as createCodeNode } from "@lexical/code";
  import {
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
  } from "@lexical/list";

  const supportedBlockTypes = new Set([
    "paragraph",
    "quote",
    "code",
    "h1",
    "h2",
    "ul",
    "ol",
  ]);

  const blockTypeToBlockName = {
    code: "Code Block",
    h1: "Large Heading",
    h2: "Small Heading",
    h3: "Heading",
    h4: "Heading",
    h5: "Heading",
    ol: "Numbered List",
    paragraph: "Normal",
    quote: "Quote",
    ul: "Bulleted List",
  };

  let editor = getContext("editor");
  let button;
  let showBlockOptionsDropDown = false;

  async function showDropdown(event) {
    showBlockOptionsDropDown = !showBlockOptionsDropDown;
    
    if (showBlockOptionsDropDown && button) {
      const handle = (event) => {   
        if (!button.contains(event.target)) {
          showBlockOptionsDropDown = false;
          button.removeEventListener("click", handle);
        }     
      };
      document.addEventListener("click", handle);
    }
  } 

  const formatParagraph = () => {
    if ($blockType !== "paragraph") {
      editor.update(() => {
        const selection = getSelection();

        if (isRangeSelection(selection)) {
          wrapLeafNodesInElements(selection, () => createParagraphNode());
        }
      });
    }
  };

  const formatLargeHeading = () => {
    if ($blockType !== "h1") {
      editor.update(() => {
        const selection = getSelection();

        if (isRangeSelection(selection)) {
          wrapLeafNodesInElements(selection, () => createHeadingNode("h1"));
        }
      });
    }
  };

  const formatSmallHeading = () => {
    if ($blockType !== "h2") {
      editor.update(() => {
        const selection = getSelection();

        if (isRangeSelection(selection)) {
          wrapLeafNodesInElements(selection, () => createHeadingNode("h2"));
        }
      });
    }
  };

  const formatVerySmallHeading = () => {
    if ($blockType !== "h3") {
      editor.update(() => {
        const selection = getSelection();

        if (isRangeSelection(selection)) {
          wrapLeafNodesInElements(selection, () => createHeadingNode("h3"));
        }
      });
    }
  };

  const formatBulletList = () => {
    if ($blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatNumberedList = () => {
    if ($blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatQuote = () => {
    if ($blockType !== "quote") {
      editor.update(() => {
        const selection = getSelection();

        if (isRangeSelection(selection)) {
          wrapLeafNodesInElements(selection, () => createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if ($blockType !== "code") {
      editor.update(() => {
        const selection = getSelection();

        if (isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            wrapLeafNodesInElements(selection, () => createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = createCodeNode();
            selection.removeText();
            selection.insertNodes([codeNode]);
            selection.insertRawText(textContent);
          }
        }
      });
    }
  };
</script>

<button
  class="toolbar-item block-controls"
  bind:this={button}
  on:click={showDropdown}
  aria-label="Formatting Options"
>
  <span class={"icon block-type " + $blockType} />
  <span class="text">{blockTypeToBlockName[$blockType]}</span>
  <i class="chevron-down" />
</button>
{#if showBlockOptionsDropDown}
  <div class="dropdown" style={"top: 45px;left:45px"}>
    <button class="item" on:click={formatParagraph}>
      <span class="icon paragraph" />
      <span class="text">Normal</span>
      {#if $blockType === "paragraph"}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={formatLargeHeading}>
      <span class="icon large-heading" />
      <span class="text">Large Heading</span>
      {#if $blockType === "h1"}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={formatSmallHeading}>
      <span class="icon small-heading" />
      <span class="text">Small Heading</span>
      {#if $blockType === "h2"}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={formatBulletList}>
      <span class="icon bullet-list" />
      <span class="text">Bullet List</span>
      {#if $blockType === "ul"}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={formatNumberedList}>
      <span class="icon numbered-list" />
      <span class="text">Numbered List</span>
      {#if $blockType === "ol"}
        <span class="active" />
      {/if}
    </button>
    <button class="item" on:click={formatQuote}>
      <span class="icon quote" />
      <span class="text">Quote</span>
      {#if $blockType === "quote"}
        <span class="active" />
      {/if}
    </button>
    <!--<button class="item" on:click={formatCode}>
      <span class="icon code" />
      <span class="text">Code Block</span>
      {#if $blockType === "code"}
        <span class="active" />
      {/if}
    </button>-->
  </div>
{/if}
