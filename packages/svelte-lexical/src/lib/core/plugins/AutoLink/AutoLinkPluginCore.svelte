<script lang="ts">
  import type {ChangeHandler, LinkMatcher} from '@lexical/link';

  import {AutoLinkNode, registerAutoLink} from '@lexical/link';
  import {getEditor} from '../../composerContext.js';
  import {onMount} from 'svelte';

  const editor = getEditor();
  interface Props {
    matchers: Array<LinkMatcher>;
    onChange?: ChangeHandler | undefined;
  }

  let {matchers, onChange = undefined}: Props = $props();

  onMount(() => {
    if (!editor.hasNodes([AutoLinkNode])) {
      throw new Error('AutoLinkPlugin: AutoLinkNode not registered on editor');
    }

    return registerAutoLink(editor, {
      changeHandlers: onChange ? [onChange] : [],
      matchers,
    });
  });
</script>
