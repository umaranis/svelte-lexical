<script lang="ts">
  import {run} from 'svelte/legacy';

  import {
    addClassNamesToElement,
    mergeRegister,
    removeClassNamesFromElement,
  } from '@lexical/utils';
  import {
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    type LexicalEditor,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {
    clearSelection,
    createNodeSelectionStore,
  } from '../nodeSelectionStore.js';

  interface Props {
    editor: LexicalEditor;
    nodeKey: string;
    self: HTMLElement;
  }

  let {editor, nodeKey, self}: Props = $props();
  let isSelected = createNodeSelectionStore(editor, nodeKey);
  const isSelectedClassName = editor._config.theme.hrSelected ?? 'selected';

  run(() => {
    if ($isSelected) {
      addClassNamesToElement(self, isSelectedClassName);
    } else {
      removeClassNamesFromElement(self, isSelectedClassName);
    }
  });

  onMount(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          if (event.target === self) {
            if (!event.shiftKey) {
              clearSelection(editor);
            }
            $isSelected = !$isSelected;
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  });
</script>
