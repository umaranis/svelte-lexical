<script lang="ts">
  import {BLUR_COMMAND, COMMAND_PRIORITY_EDITOR} from 'lexical';
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext.js';
  import {$isCaptionEditorEmpty as isCaptionEditorEmpty} from './ImageNode.js';

  interface Props {
    setShowCaption: (show: boolean) => void;
  }

  let {setShowCaption}: Props = $props();

  const editor = getEditor();

  onMount(() =>
    editor.registerCommand(
      BLUR_COMMAND,
      () => {
        if (isCaptionEditorEmpty()) {
          setShowCaption(false);
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR,
    ),
  );
</script>
