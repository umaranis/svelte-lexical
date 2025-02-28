<script lang="ts">
  import {onMount} from 'svelte';
  import {getEditor} from '../composerContext.js';
  import {FocusEditor} from '../commands.js';

  const editor = getEditor();

  onMount(() => {
    FocusEditor(editor);
  });
</script>
