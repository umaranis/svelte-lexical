<script lang="ts">
  import {$wrapNodeInElement as wrapNodeInElement} from '@lexical/utils';
  import {
    $createParagraphNode as createParagraphNode,
    $insertNodes as insertNodes,
    $isRootOrShadowRoot as isRootOrShadowRoot,
    COMMAND_PRIORITY_EDITOR,
  } from 'lexical';
  import {
    $createDateTimeNode as createDateTimeNode,
    DateTimeNode,
    INSERT_DATETIME_COMMAND,
    type DateTimePayload,
  } from './DateTimeNode.js';
  import {getEditor} from '$lib/core/composerContext.js';

  const editor = getEditor();

  $effect(() => {
    if (!editor.hasNodes([DateTimeNode])) {
      throw new Error('DateTimePlugin: DateTimeNode not registered on editor');
    }

    return editor.registerCommand<DateTimePayload>(
      INSERT_DATETIME_COMMAND,
      (payload) => {
        const {dateTime} = payload;
        const dateTimeNode = createDateTimeNode(dateTime);

        insertNodes([dateTimeNode]);
        if (isRootOrShadowRoot(dateTimeNode.getParentOrThrow())) {
          wrapNodeInElement(dateTimeNode, createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  });
</script>
