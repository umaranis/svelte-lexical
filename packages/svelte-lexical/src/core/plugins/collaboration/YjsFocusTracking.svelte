<script lang="ts">
  import pkgUtil from '@lexical/utils';
  const {mergeRegister} = pkgUtil;
  import {type Provider} from '@lexical/yjs';
  import pkgYjs from '@lexical/yjs';
  const {setLocalStateFocus} = pkgYjs;
  import {type LexicalEditor} from 'lexical';
  import pkgLx from 'lexical';
  const {BLUR_COMMAND, COMMAND_PRIORITY_EDITOR, FOCUS_COMMAND} = pkgLx;
  import {onMount} from 'svelte';

  export let editor: LexicalEditor;
  export let provider: Provider;
  export let name: string;
  export let color: string;

  onMount(() => {
    const {awareness} = provider;

    return mergeRegister(
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setLocalStateFocus(provider, name, color, true, awareness);
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setLocalStateFocus(provider, name, color, false, awareness);
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  });
</script>
