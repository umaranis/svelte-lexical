<script>
  import Toolbar from '../toolbar/Toolbar.svelte';
  import RichTextEditor from './RichTextSimpleEditor.svelte';

  export let theme;
</script>

<div class="editor-shell">
  <RichTextEditor {theme}>
    <Toolbar slot="toolbar" />
  </RichTextEditor>
  <div class="actions" />
</div>
