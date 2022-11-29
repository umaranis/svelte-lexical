<script>
  import ToolbarRichText from './ToolbarRichText.svelte';
  import RichTextEditor from './RichTextEditor.svelte';
  import ActionBar from "../actionbar/ActionBar.svelte";

  export let theme;
</script>

<div class="editor-shell">
  <RichTextEditor {theme}>
    <ToolbarRichText slot="toolbar" />
    <ActionBar slot="actions"/>
  </RichTextEditor>
</div>
