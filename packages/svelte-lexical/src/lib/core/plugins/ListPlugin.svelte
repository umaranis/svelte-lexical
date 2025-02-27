<script lang="ts">
  import {onMount} from 'svelte';
  import {registerList} from '@lexical/list';
  import {getEditor} from '../composerContext.js';

  const editor = getEditor();

  onMount(() => {
    // returns callback to unregister
    return registerList(editor);
  });
</script>
