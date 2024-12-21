<script lang="ts">
  import {mergeRegister} from '@lexical/utils';
  import {setLocalStateFocus, type Provider} from '@lexical/yjs';
  import {
    BLUR_COMMAND,
    COMMAND_PRIORITY_EDITOR,
    FOCUS_COMMAND,
    type LexicalEditor,
  } from 'lexical';
  import {onMount} from 'svelte';

  interface Props {
    editor: LexicalEditor;
    provider: Provider;
    name: string;
    color: string;
    awarenessData?: object | undefined;
  }

  let {
    editor,
    provider,
    name,
    color,
    awarenessData = undefined,
  }: Props = $props();

  onMount(() => {
    return mergeRegister(
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setLocalStateFocus(provider, name, color, true, awarenessData || {});
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setLocalStateFocus(provider, name, color, false, awarenessData || {});
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  });
</script>
