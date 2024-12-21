<script lang="ts">
  import type {LexicalEditor} from 'lexical';
  import {$canShowPlaceholderCurry as canShowPlaceholderCurry} from '@lexical/text';
  import {getEditor} from '../composerContext.js';
  import {onMount} from 'svelte';
  import {mergeRegister} from '@lexical/utils';

  interface Props {
    className?: string;
    children?: import('svelte').Snippet;
  }

  let {className = 'Placeholder__root', children}: Props = $props();

  const editor = getEditor();
  let canShowPlaceHolder = $state(true);

  onMount(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        canShowPlaceHolder = canShowPlaceholderFromCurrentEditorState(editor);
      }),
      editor.registerEditableListener(() => {
        canShowPlaceHolder = canShowPlaceholderFromCurrentEditorState(editor);
      }),
    );
  });

  function canShowPlaceholderFromCurrentEditorState(
    editor: LexicalEditor,
  ): boolean {
    const currentCanShowPlaceholder = editor
      .getEditorState()
      .read(canShowPlaceholderCurry(editor.isComposing()));

    return currentCanShowPlaceholder;
  }
</script>

{#if canShowPlaceHolder}
  <div class={className}>
    {@render children?.()}
  </div>
{/if}

<style>
  .Placeholder__root {
    font-size: 15px;
    color: #999;
    overflow: hidden;
    position: absolute;
    text-overflow: ellipsis;
    top: 8px;
    left: 10px; /* 10px instead of 28px as we don't have the re-arrange handle implemented yet*/
    right: 28px;
    user-select: none;
    white-space: nowrap;
    display: inline-block;
    pointer-events: none;
  }

  @media (max-width: 1025px) {
    .Placeholder__root {
      left: 8px;
    }
  }
</style>
