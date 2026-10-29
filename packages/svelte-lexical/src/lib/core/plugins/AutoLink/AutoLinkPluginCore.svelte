<script lang="ts">
  import type {ChangeHandler, LinkMatcher} from '@lexical/link';
  import type {ElementNode} from 'lexical';

  import {AutoLinkNode, registerAutoLink} from '@lexical/link';
  import {getEditor} from '../../composerContext.js';
  import {onMount} from 'svelte';

  const editor = getEditor();
  interface Props {
    matchers: Array<LinkMatcher>;
    onChange?: ChangeHandler | undefined;
    excludeParents?: Array<(parent: ElementNode) => boolean>;
  }

  let {matchers, onChange = undefined, excludeParents}: Props = $props();

  onMount(() => {
    if (!editor.hasNodes([AutoLinkNode])) {
      throw new Error('AutoLinkPlugin: AutoLinkNode not registered on editor');
    }

    return registerAutoLink(editor, {
      changeHandlers: onChange ? [onChange] : [],
      excludeParents: excludeParents ?? [],
      matchers,
    });
  });
</script>
