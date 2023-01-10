<script>
  import './ContentEditable.css';

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
