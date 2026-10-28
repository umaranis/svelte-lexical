<script lang="ts">
  import {namedSignals} from '@lexical/extension';
  import {LinkNode, registerLink, type LinkAttributes} from '@lexical/link';
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext.js';

  type Props = {
    validateUrl?: (url: string) => boolean;
    attributes?: LinkAttributes;
  };

  let {validateUrl = undefined, attributes = {}}: Props = $props();

  const editor = getEditor();

  onMount(() => {
    if (!editor.hasNodes([LinkNode])) {
      throw new Error('LinkPlugin: LinkNode not registered on editor');
    }
    return registerLink(editor, namedSignals({attributes, validateUrl}));
  });
</script>
