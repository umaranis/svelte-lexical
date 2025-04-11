<script module lang="ts">
  export const INSERT_TWEET_COMMAND: LexicalCommand<string> = createCommand(
    'INSERT_TWEET_COMMAND',
  );
</script>

<script lang="ts">
  import {$insertNodeToNearestRoot as insertNodeToNearestRoot} from '@lexical/utils';
  import {
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
  } from 'lexical';

  import {$createTweetNode as createTweetNode, TweetNode} from './TweetNode.js';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();

  $effect(() => {
    if (!editor.hasNodes([TweetNode])) {
      throw new Error('TwitterPlugin: TweetNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_TWEET_COMMAND,
      (payload) => {
        const tweetNode = createTweetNode(payload);
        insertNodeToNearestRoot(tweetNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  });
</script>
