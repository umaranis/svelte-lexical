<script>
  import ToolbarRichText from './ToolbarRichText.svelte';
  import RichTextEditor from './RichTextEditor.svelte';
  import ActionBar from '../actionbar/ActionBar.svelte';

  export let theme;
</script>

<RichTextEditor {theme}>
  <ToolbarRichText slot="toolbar" />
  <ActionBar slot="actions" />
</RichTextEditor>
