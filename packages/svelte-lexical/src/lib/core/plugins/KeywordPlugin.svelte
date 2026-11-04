<script lang="ts">
  import {KeywordNode, registerKeywords} from './KeywordNode.js';
  import {getEditor} from '../composerContext.js';
  import {onMount} from 'svelte';

  interface Props {
    keywordsRegex: RegExp;
  }

  let {keywordsRegex}: Props = $props();

  const editor = getEditor();

  if (!editor.hasNodes([KeywordNode])) {
    throw new Error('KeywordsPlugin: KeywordNode not registered on editor');
  }

  onMount(() => {
    return registerKeywords(editor, keywordsRegex);
  });
</script>
