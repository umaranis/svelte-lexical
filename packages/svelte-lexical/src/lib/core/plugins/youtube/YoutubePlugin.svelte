<script module lang="ts">
  export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand(
    'INSERT_YOUTUBE_COMMAND',
  );
</script>

<script lang="ts">
  import {$insertNodeToNearestRoot as insertNodeToNearestRoot} from '@lexical/utils';
  import {
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
  } from 'lexical';

  import {
    $createYouTubeNode as createYouTubeNode,
    YouTubeNode,
  } from './YouTubeNode.js';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();

  $effect(() => {
    if (!editor.hasNodes([YouTubeNode])) {
      throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const youTubeNode = createYouTubeNode(payload);
        insertNodeToNearestRoot(youTubeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  });
</script>
