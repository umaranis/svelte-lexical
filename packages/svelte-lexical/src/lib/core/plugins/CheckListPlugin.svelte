<script lang="ts">
  import type {LexicalEditor} from 'lexical';

  import {registerCheckList} from '@lexical/list';
  import {onMount} from 'svelte';
  import {getEditor} from '../composerContext.js';

  const editor: LexicalEditor = getEditor();

  onMount(() => {
    return registerCheckList(editor);
  });
</script>
