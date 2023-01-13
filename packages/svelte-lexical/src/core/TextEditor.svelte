<script>
  //import './ContentEditable.css';

  import {createEditor} from 'lexical';
  import {onMount, setContext} from 'svelte';
  import {initializeEditor} from './initializeEditor.ts';

  export let config = {};
  let contentEditableElement;

  const editor = createEditor(config);
  setContext('editor', editor);

  onMount(() => {
    editor.setRootElement(contentEditableElement);
    initializeEditor(editor);
  });
</script>

<div class="editor-shell">
  <slot name="toolbar" />
  <div class="editor-container">
    <div class="editor-scroller">
      <div class="editor">
        <div
          contenteditable="true"
          bind:this={contentEditableElement}
          class="ContentEditable__root" />
      </div>
    </div>
    <!-- slot for plugins -->
    <slot />
    <slot name="actions" />
  </div>
</div>

<style>
  /*
   Updating this file to the latest from lexical introduces couple of issues:
   1- Empty editor only receives focus when you click on the first line inside the editor.
   2- Left and right padding is increased a lot which only makes sense when block rearrange handle is enabled (not implemented yet and won't be included in simple editors)
  */
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
