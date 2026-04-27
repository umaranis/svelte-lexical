<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import {registerCodeHighlighting} from '@lexical/code-shiki';

  const editor = getEditor();

  $effect(() => {
    return registerCodeHighlighting(editor);
  });
</script>
