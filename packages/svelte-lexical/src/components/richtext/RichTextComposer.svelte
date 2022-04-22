<script>
  import Toolbar from '../richtext-basic/ToolbarBasic.svelte';
  import RichTextEditor from './RichTextEditor.svelte';

  export let theme;
</script>

<div class="editor-shell">
  <RichTextEditor {theme}>
    <Toolbar slot="toolbar" />
  </RichTextEditor>
  <div class="actions" />
</div>
