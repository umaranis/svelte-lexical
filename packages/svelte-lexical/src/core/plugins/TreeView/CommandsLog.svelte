<script lang="ts">
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext';
  import {COMMAND_PRIORITY_HIGH, type LexicalCommand} from 'lexical';

  const editor = getEditor();

  export let loggedCommands: ReadonlyArray<
    LexicalCommand<unknown> & {payload: unknown}
  > = [];

  onMount(() => {
    const unregisterCommandListeners = new Set<() => void>();

    for (const [command] of editor._commands) {
      unregisterCommandListeners.add(
        editor.registerCommand(
          command,
          (payload) => {
            const newState = [...loggedCommands];
            newState.push({
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
