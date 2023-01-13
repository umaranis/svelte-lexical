<script context="module" lang="ts">
  const imageCache = new Set();
</script>

<script lang="ts">
  //import './ImageNode.css';
  import {
    $getSelection as getSelection,
    $isNodeSelection as isNodeSelection,
    type GridSelection,
    type LexicalEditor,
    type NodeSelection,
    type RangeSelection,
    $getNodeByKey as getNodeByKey,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_LOW,
    CLICK_COMMAND,
    DRAGSTART_COMMAND,
    KEY_DELETE_COMMAND,
    KEY_BACKSPACE_COMMAND,
    KEY_ESCAPE_COMMAND,
    KEY_ENTER_COMMAND,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {mergeRegister} from '@lexical/utils';
  import ImageResizer from '../../components/ImageResizer.svelte';
  import {$isImageNode as isImageNode} from './ImageNode';
  import {
    clearSelection,
    createNodeSelectionStore,
  } from '../nodeSelectionStore';

  export let src: string;
  export let altText: string;
  export let nodeKey: string;
  export let width: 'inherit' | number;
  export let height: 'inherit' | number;
  export let maxWidth: number;
  export let resizable: boolean;
  export let showCaption: boolean;
  export let caption: LexicalEditor;
  export let captionsEnabled: boolean;
  export let editor: LexicalEditor;

  let selection: RangeSelection | NodeSelection | GridSelection | null = null;

  let imageRef: HTMLImageElement | null;
  let buttonRef: HTMLButtonElement | null;
  let isSelected = createNodeSelectionStore(editor, nodeKey);
  let isResizing = false;
  //const isCollabActive = false; //TODO: const {isCollabActive} = useCollaborationContext();
  let activeEditorRef: LexicalEditor;

  $: draggable = $isSelected && isNodeSelection(selection) && !isResizing;
  $: isFocused = $isSelected || isResizing;

  let promise = new Promise((resolve) => {
    if (imageCache.has(src)) {
      resolve(null);
    } else {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    }
  });

  const onDelete = (payload: KeyboardEvent) => {
    if ($isSelected && isNodeSelection(getSelection())) {
      const event: KeyboardEvent = payload;
      event.preventDefault();
      const node = getNodeByKey(nodeKey);
      if (isImageNode(node)) {
        node.remove();
      }
      $isSelected = false;
    }
    return false;
  };

  const onEnter = (event: KeyboardEvent) => {
    const latestSelection = getSelection();
    const buttonElem = buttonRef;
    if (
      $isSelected &&
      isNodeSelection(latestSelection) &&
      latestSelection.getNodes().length === 1
    ) {
      if (showCaption) {
        // Move focus into nested editor
        selection = null;
        event.preventDefault();
        caption.focus();
        return true;
      } else if (buttonElem !== null && buttonElem !== document.activeElement) {
        event.preventDefault();
        buttonElem.focus();
        return true;
      }
    }
    return false;
  };

  const onEscape = (event: KeyboardEvent) => {
    if (activeEditorRef === caption || buttonRef === event.target) {
      selection = null;
      editor.update(() => {
        $isSelected = true;
        const parentRootElement = editor.getRootElement();
        if (parentRootElement !== null) {
          parentRootElement.focus();
        }
      });
      return true;
    }
    return false;
  };

  onMount(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        selection = editorState.read(() => getSelection());
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (isResizing) {
            return true;
          }
          if (event.target === imageRef) {
            if (event.shiftKey) {
              $isSelected = !$isSelected;
            } else {
              clearSelection(editor);
              $isSelected = true;
            }
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        onEscape,
        COMMAND_PRIORITY_LOW,
      ),
    );
  });

  const setShowCaption = () => {
    editor.update(() => {
      const node = getNodeByKey(nodeKey);
      if (isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  };

  const onResizeEnd = (
    nextWidth: 'inherit' | number,
    nextHeight: 'inherit' | number,
  ) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      isResizing = false;
    }, 200);

    editor.update(() => {
      const node = getNodeByKey(nodeKey);
      if (isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    isResizing = true;
  };
</script>

<div {draggable}>
  {#await promise}
    <p>...loading image</p>
  {:then _}
    <img
      class:focused={isFocused}
      class:draggable={isFocused && isNodeSelection(selection)}
      {src}
      alt={altText}
      bind:this={imageRef}
      style="height:{height}px;width:{width}px;max-width:{maxWidth}px;"
      draggable="false" />
  {/await}
</div>
{#if resizable && isNodeSelection(selection) && isFocused}
  <ImageResizer
    {showCaption}
    {setShowCaption}
    {editor}
    {buttonRef}
    {imageRef}
    {maxWidth}
    {onResizeStart}
    {onResizeEnd}
    {captionsEnabled} />
{/if}

<style>
  .ImageNode__contentEditable {
    min-height: 20px;
    border: 0px;
    resize: none;
    cursor: text;
    caret-color: rgb(5, 5, 5);
    display: block;
    position: relative;
    tab-size: 1;
    outline: 0px;
    padding: 10px;
    user-select: text;
    font-size: 12px;
    width: calc(100% - 20px);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .ImageNode__placeholder {
    font-size: 12px;
    color: #888;
    overflow: hidden;
    position: absolute;
    text-overflow: ellipsis;
    top: 10px;
    left: 10px;
    user-select: none;
    white-space: nowrap;
    display: inline-block;
    pointer-events: none;
  }

  .image-control-wrapper--resizing {
    touch-action: none;
  }
</style>
