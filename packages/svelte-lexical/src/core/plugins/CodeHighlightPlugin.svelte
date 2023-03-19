<script lang="ts">
  import {registerCodeHighlighting} from '@lexical/code';
  import {onMount} from 'svelte';
  import {getEditor} from '../svelteContext';

  const editor = getEditor();

  onMount(() => {
    return registerCodeHighlighting(editor);
  });
</script>
