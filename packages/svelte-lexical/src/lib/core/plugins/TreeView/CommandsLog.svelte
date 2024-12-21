<script lang="ts">
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext.js';
  import {COMMAND_PRIORITY_HIGH, type LexicalCommand} from 'lexical';

  const editor = getEditor();

  interface Props {
    loggedCommands?: ReadonlyArray<
      {index: number} & LexicalCommand<unknown> & {payload: unknown}
    >;
  }

  let {loggedCommands = $bindable([])}: Props = $props();

  onMount(() => {
    const unregisterCommandListeners = new Set<() => void>();

    let i = 0;
    for (const [command] of editor._commands) {
      unregisterCommandListeners.add(
        editor.registerCommand(
          command,
          (payload) => {
            i += 1;
            const newState = [...loggedCommands];
            newState.push({
              index: i,
              payload,
              type: command.type ? command.type : 'UNKNOWN',
            });

            if (newState.length > 10) {
              newState.shift();
            }

            loggedCommands = newState;

            return false;
          },
          COMMAND_PRIORITY_HIGH,
        ),
      );
    }

    return () =>
      unregisterCommandListeners.forEach((unregister) => unregister());
  });
</script>
