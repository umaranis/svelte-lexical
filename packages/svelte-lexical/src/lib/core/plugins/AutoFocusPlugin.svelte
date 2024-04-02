<script lang="ts">
  import {onMount} from 'svelte';
  import {getEditor} from '../composerContext.js';
  import {getCommands} from '../commands.js';

  const editor = getEditor();

  onMount(() => {
    getCommands().FocusEditor.execute(editor);
  });
</script>
