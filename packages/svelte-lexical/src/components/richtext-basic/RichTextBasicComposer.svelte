<script>
  import Toolbar from './ToolbarBasic.svelte';
  import RichTextBasicEditor from './RichTextBasicEditor.svelte';

  export let theme;
</script>

<div class="editor-shell">
  <RichTextBasicEditor {theme}>
    <Toolbar slot="toolbar" />
  </RichTextBasicEditor>
  <div class="actions" />
</div>
