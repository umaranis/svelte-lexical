<script module lang="ts">
  export const INSERT_BLUESKY_COMMAND: LexicalCommand<{
    profile: string;
    postKey: string;
  }> = createCommand('INSERT_BLUESKY_COMMAND');
</script>

<script lang="ts">
  import {$insertNodeToNearestRoot as insertNodeToNearestRoot} from '@lexical/utils';
  import {
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
  } from 'lexical';

  import {
    $createBlueskyNode as createBlueskyNode,
    BlueskyNode,
  } from './BlueskyNode.js';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();

  $effect(() => {
    if (!editor.hasNodes([BlueskyNode])) {
      throw new Error('BlueskyPlugin: BlueskyNode not registered on editor');
    }

    return editor.registerCommand<{profile: string; postKey: string}>(
      INSERT_BLUESKY_COMMAND,
      ({profile, postKey}) => {
        const blueskyNode = createBlueskyNode(profile, postKey);
        insertNodeToNearestRoot(blueskyNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  });
</script>
