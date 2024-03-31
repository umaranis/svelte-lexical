<script lang="ts">
  import {onMount} from 'svelte';
  import {getEditor} from '../composerContext';
  import {getCommands} from '../commands';

  const editor = getEditor();

  onMount(() => {
    getCommands().FocusEditor.execute(editor);
  });
</script>
