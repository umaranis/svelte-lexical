<script>
  import Toolbar from './ToolbarBasic.svelte';
  import RichTextSimpleEditor from './RichTextBasicEditor.svelte';

  export let theme;
</script>

<div class="editor-shell">
  <RichTextSimpleEditor {theme}>
    <Toolbar slot="toolbar" />
  </RichTextSimpleEditor>
  <div class="actions" />
</div>
