<script module lang="ts">
  const imageCache = new Set();

  export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
    createCommand('RIGHT_CLICK_IMAGE_COMMAND');
</script>

<script lang="ts">
  import './ImageNodeStyles.css';
  import {
    $getSelection as getSelection,
    $isNodeSelection as isNodeSelection,
    type LexicalEditor,
    type LexicalCommand,
    $getNodeByKey as getNodeByKey,
    $isRangeSelection as isRangeSelection,
    createCommand,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_LOW,
    CLICK_COMMAND,
    DRAGSTART_COMMAND,
    KEY_ESCAPE_COMMAND,
    KEY_ENTER_COMMAND,
    type BaseSelection,
  } from 'lexical';
  import {onMount} from 'svelte';
  import {mergeRegister} from '@lexical/utils';
  import ImageResizer from './ImageResizer.svelte';
  import {$isImageNode as isImageNode} from './ImageNode.js';
  import {
    clearSelection,
    createNodeSelectionStore,
  } from '../../nodeSelectionStore.js';
  import NestedComposer from '../../NestedComposer.svelte';
  import ContentEditable from '../../ContentEditable.svelte';
  import RichTextPlugin from '../RichTextPlugin.svelte';
  import PlaceHolder from '../PlaceHolder.svelte';
  import AutoFocusPlugin from '../AutoFocusPlugin.svelte';
  import {
    getImageHistoryPluginType,
    getIsEditable,
  } from '../../composerContext.js';
  import {writable, type Writable} from 'svelte/store';

  interface Props {
    src: string;
    altText: string;
    nodeKey: string;
    width: 'inherit' | number;
    height: 'inherit' | number;
    maxWidth: number;
    resizable: boolean;
    showCaption: boolean;
    caption: LexicalEditor;
    captionsEnabled: boolean;
    editor: LexicalEditor;
  }

  let {
    src,
    altText,
    nodeKey,
    width,
    height,
    maxWidth,
    resizable,
    showCaption,
    caption,
    captionsEnabled,
    editor,
  }: Props = $props();

  let heightCss = $derived(height === 'inherit' ? 'inherit' : height + 'px');
  let widthCss = $derived(width === 'inherit' ? 'inherit' : width + 'px');

  let selection: BaseSelection | null = $state(null);

  let imageRef: HTMLImageElement | null = $state(null);
  let buttonRef: Writable<HTMLButtonElement | null> = writable(null);
  let isSelected = createNodeSelectionStore(editor, nodeKey);
  let isResizing = $state(false);
  let activeEditorRef: LexicalEditor;
  let isEditable = getIsEditable();

  let draggable = $derived(
    $isSelected && isNodeSelection(selection) && !isResizing,
  );
  let isFocused = $derived(($isSelected || isResizing) && $isEditable);

  let promise = new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve(null);
    } else {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
      img.onerror = () => {
        reject(null);
      };
    }
  });

  const onEnter = (event: KeyboardEvent) => {
    const latestSelection = getSelection();
    const buttonElem = $buttonRef;
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
    if (activeEditorRef === caption || $buttonRef === event.target) {
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

  const onClick = (payload: MouseEvent) => {
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
  };

  const onRightClick = (event: MouseEvent): void => {
    editor.getEditorState().read(() => {
      const latestSelection = getSelection();
      const domElement = event.target as HTMLElement;
      if (
        domElement.tagName === 'IMG' &&
        isRangeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event as MouseEvent);
      }
    });
  };

  onMount(() => {
    const rootElement = editor.getRootElement();
    const unregister = mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        const updatedSelection = editorState.read(() => getSelection());
        if (isNodeSelection(updatedSelection)) {
          selection = updatedSelection;
        } else {
          selection = null;
        }
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
        onClick,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        RIGHT_CLICK_IMAGE_COMMAND,
        onClick,
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
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        onEscape,
        COMMAND_PRIORITY_LOW,
      ),
    );

    rootElement?.addEventListener('contextmenu', onRightClick);

    return () => {
      unregister();
      rootElement?.removeEventListener('contextmenu', onRightClick);
    };
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

  const historyPlugin = getImageHistoryPluginType();
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
      style="height:{heightCss};max-width:{maxWidth}px;width:{widthCss};"
      draggable="false" />
  {:catch _}
    <img
      src="/images/image-broken.svg"
      alt="broken link"
      style="height: 200px; width: 200px; opacity: 0.2;"
      draggable="false" />
  {/await}
</div>
{#if showCaption}
  <div class="image-caption-container">
    <NestedComposer initialEditor={caption} parentEditor={editor}>
      <AutoFocusPlugin />

      <!-- {#if isCollabActive}
        <CollaborationPlugin
          id={caption.getKey()}
          providerFactory={createWebsocketProvider}
          shouldBootstrap={true} />
      {:else}
        <SharedHistoryPlugin />
      {/if} -->
      <historyPlugin.componentType {...historyPlugin.props} />

      <RichTextPlugin />
      <ContentEditable className="ImageNode__contentEditable" />
      <PlaceHolder className="ImageNode__placeholder">
        Enter image caption...
      </PlaceHolder>
      <!-- TODO: {showNestedEditorTreeView === true ? <TreeViewPlugin /> : null} -->
    </NestedComposer>
  </div>
{/if}
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
