<script lang="ts">
  import {HashtagNode, registerLexicalHashtag} from '@lexical/hashtag';
  import {onMount} from 'svelte';
  import {getEditor} from '../composerContext.js';

  const editor = getEditor();

  if (!editor.hasNodes([HashtagNode])) {
    throw new Error('HashtagPlugin: HashtagNode not registered on editor');
  }

  onMount(() => {
    return registerLexicalHashtag(editor);
  });
</script>
