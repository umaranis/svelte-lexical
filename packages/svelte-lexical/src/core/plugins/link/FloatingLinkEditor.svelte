<script lang="ts">
  import {$isLinkNode as isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
  import {mergeRegister} from '@lexical/utils';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    KEY_ESCAPE_COMMAND,
    SELECTION_CHANGE_COMMAND,
    type GridSelection,
    type LexicalEditor,
    type NodeSelection,
    type RangeSelection,
  } from 'lexical';
  import {onMount} from 'svelte';
  import type {Writable} from 'svelte/store';
  import getSelectedNode from '../../../components/toolbar/getSelectionInfo';
  import {setFloatingElemPosition} from '../util/setFloatingElemPosition';
  import {sanitizeUrl} from './url';

  export let editor: LexicalEditor;
  export let isLink: Writable<boolean>;
  export let anchorElem: HTMLElement;

  let editorRef: HTMLDivElement | null;
  let inputRef: HTMLInputElement;
  let linkUrl = '';
  let isEditMode = false;
  let lastSelection: RangeSelection | GridSelection | NodeSelection | null =
    null;

  $: if (isEditMode && inputRef) {
    inputRef.focus();
  }

  $: if (anchorElem && editorRef) {
    anchorElem.appendChild(editorRef as Node);
  }

  onMount(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor();
      });
    };

    window.addEventListener('resize', update);

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return mergeRegister(
      () => {
        window.removeEventListener('resize', update);

        if (scrollerElem) {
          scrollerElem.removeEventListener('scroll', update);
        }
      },

      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),

      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if ($isLink) {
            $isLink = false;
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  });

  function updateLinkEditor() {
    const selection = getSelection();
    if (isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if (isLinkNode(parent)) {
        linkUrl = parent.getURL();
      } else if (isLinkNode(node)) {
        linkUrl = node.getURL();
      } else {
        linkUrl = '';
      }
    }
    const editorElem = editorRef;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      setFloatingElemPosition(rect, editorElem, anchorElem);
      lastSelection = selection;
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPosition(null, editorElem, anchorElem);
      }
      lastSelection = null;
      isEditMode = false;
      linkUrl = '';
    }

    return true;
  }
</script>

<div bind:this={editorRef} class="link-editor">
  {#if $isLink}
    {#if isEditMode}
      <input
        bind:this={inputRef}
        class="link-input"
        bind:value={linkUrl}
        on:keydown={(event) => {
          if (event.key === 'Enter' || event.key === 'Escape') {
            event.preventDefault();
            if (lastSelection !== null) {
              if (linkUrl !== '') {
                editor.dispatchCommand(
                  TOGGLE_LINK_COMMAND,
                  sanitizeUrl(linkUrl),
                );
              }
              isEditMode = false;
            }
          }
        }} />
    {:else}
      <div class="link-input">
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
          {linkUrl}
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="link-edit"
          role="button"
          tabIndex={0}
          on:mousedown={(event) => event.preventDefault()}
          on:click={() => {
            isEditMode = true;
          }} />
      </div>
      <!-- LinkPreview is not implemented because it is not working in lexical, see https://github.com/facebook/lexical/issues/4100 -->
      <!-- <LinkPreview url={linkUrl} /> -->
    {/if}
  {/if}
</div>

<style>
  .link-editor {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    max-width: 400px;
    width: 100%;
    opacity: 0;
    background-color: #fff;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    transition: opacity 0.5s;
    will-change: transform;
  }

  .link-editor .button {
    width: 20px;
    height: 20px;
    display: inline-block;
    padding: 6px;
    border-radius: 8px;
    cursor: pointer;
    margin: 0 2px;
  }

  .link-editor .button.hovered {
    width: 20px;
    height: 20px;
    display: inline-block;
    background-color: #eee;
  }

  .link-editor .button i,
  .actions i {
    background-size: contain;
    display: inline-block;
    height: 20px;
    width: 20px;
    vertical-align: -0.25em;
  }
</style>
