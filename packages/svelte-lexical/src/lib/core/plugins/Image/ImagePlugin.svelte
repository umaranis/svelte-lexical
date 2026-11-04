<script module lang="ts">
  export {
    INSERT_IMAGE_COMMAND,
    type InsertImagePayload,
  } from './ImageExtension.js';
</script>

<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {onMount, type Snippet} from 'svelte';
  import {ImageNode} from './ImageNode.js';
  import {registerImages} from './ImageExtension.js';
  import {getEditor} from '../../composerContext.js';

  const editor: LexicalEditor = getEditor();

  interface Props {
    captionsEnabled?: boolean;
    children?: Snippet;
  }

  let {captionsEnabled = true, children}: Props = $props();

  onMount(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return registerImages(editor, {captionsEnabled});
  });
</script>

<!--for ImageComponent history plugin -->
{@render children?.()}
