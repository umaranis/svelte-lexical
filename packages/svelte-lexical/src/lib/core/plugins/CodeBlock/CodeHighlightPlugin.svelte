<script lang="ts">
  import {registerCodeHighlighting} from '@lexical/code';
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext.js';

  const editor = getEditor();

  onMount(() => {
    return registerCodeHighlighting(editor);
  });
</script>
