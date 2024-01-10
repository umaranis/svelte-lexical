<script lang="ts">
  import {onMount} from 'svelte';
  import pkg from '@lexical/list';
  const {
    $handleListInsertParagraph: handleListInsertParagraph,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    insertList,
    REMOVE_LIST_COMMAND,
    removeList,
  } = pkg;
  import {mergeRegister} from '@lexical/utils';
  import {COMMAND_PRIORITY_LOW, INSERT_PARAGRAPH_COMMAND} from 'lexical';
  import {getEditor} from '../composerContext';

  const editor = getEditor();

  onMount(() => {
    // returns callback to unregister
    return mergeRegister(
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'number');
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          insertList(editor, 'bullet');
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        REMOVE_LIST_COMMAND,
        () => {
          removeList(editor);
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const hasHandledInsertParagraph = handleListInsertParagraph();

          if (hasHandledInsertParagraph) {
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  });
</script>
