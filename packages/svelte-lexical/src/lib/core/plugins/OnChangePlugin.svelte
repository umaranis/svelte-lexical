<script lang="ts">
  import type {EditorState, LexicalEditor} from 'lexical';
  import {HISTORY_MERGE_TAG} from 'lexical';
  import {onMount} from 'svelte';
  import {getEditor} from '../composerContext.js';

  let {
    ignoreHistoryMergeTagChange = true,
    ignoreSelectionChange = false,
    onChange,
  }: {
    ignoreHistoryMergeTagChange: boolean;
    ignoreSelectionChange: boolean;
    onChange: (
      editorState: EditorState,
      editor: LexicalEditor,
      tags: Set<string>,
    ) => void;
  } = $props();

  const editor = getEditor();

  onMount(() => {
    if (onChange) {
      editor.registerUpdateListener(
        ({editorState, dirtyElements, dirtyLeaves, prevEditorState, tags}) => {
          if (
            (ignoreSelectionChange &&
              dirtyElements.size === 0 &&
              dirtyLeaves.size === 0) ||
            (ignoreHistoryMergeTagChange && tags.has(HISTORY_MERGE_TAG)) ||
            prevEditorState.isEmpty()
          ) {
            return;
          }

          onChange(editorState, editor, tags);
        },
      );
    }
  });
</script>
