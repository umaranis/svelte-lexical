<script>
  import ToolbarRichText from './ToolbarRichText.svelte';
  import RichTextEditor from './RichTextEditor.svelte';

  export let theme;
</script>

<div class="editor-shell">
  <RichTextEditor {theme}>
    <ToolbarRichText slot="toolbar" />
  </RichTextEditor>
  <div class="actions" />
</div>
