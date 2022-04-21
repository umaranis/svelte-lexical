<script>
  import {
    createEditor,
  } from 'lexical';
  import { onMount, setContext } from 'svelte';

  export let config = {};
  let contentEditableElement;

  const editor = createEditor(config);
  setContext('editor', editor);

  onMount(() => {
    editor.setRootElement(contentEditableElement);
  });
</script>

<div
  contenteditable="true"
  bind:this={contentEditableElement}
  class="ContentEditable__root"
/>
<slot></slot> <!-- for plugins -->

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
  }
</style>
