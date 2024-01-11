<script lang="ts">
  import pkgCode from '@lexical/code';
  const {registerCodeHighlighting} = pkgCode;
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext';

  const editor = getEditor();

  onMount(() => {
    return registerCodeHighlighting(editor);
  });
</script>
