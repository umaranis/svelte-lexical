<script>
  import Toolbar from './ToolbarBasic.svelte';
  import RichTextBasicEditor from './RichTextBasicEditor.svelte';
  import ActionBar from '../actionbar/ActionBar.svelte';

  export let theme;
</script>

<RichTextBasicEditor {theme}>
  <Toolbar slot="toolbar" />
  <ActionBar slot="actions" />
</RichTextBasicEditor>
