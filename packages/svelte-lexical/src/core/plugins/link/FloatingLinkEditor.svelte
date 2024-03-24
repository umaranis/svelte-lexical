<script lang="ts">
  import './FloatingLinkEditor.css';
  import {$isLinkNode as isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
  import {
    mergeRegister,
    $findMatchingParent as findMatchingParent,
  } from '@lexical/utils';
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
  import {setFloatingElemPositionForLinkEditor} from './setFloatingElemPositionForLinkEditor';
  import {sanitizeUrl} from './url';

  export let editor: LexicalEditor;
  export let isLink: Writable<boolean>;
  export let anchorElem: HTMLElement;

  let editorRef: HTMLDivElement | null;
  let inputRef: HTMLInputElement;
  let linkUrl = '';
  let editedLinkUrl = '';
  export let isEditMode: Writable<boolean>;
  let lastSelection: RangeSelection | GridSelection | NodeSelection | null =
    null;

  $: if ($isEditMode && inputRef) {
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
      const linkParent = findMatchingParent(node, isLinkNode);
      if (isLinkNode(linkParent)) {
        linkUrl = linkParent.getURL();
      } else if (isLinkNode(node)) {
        linkUrl = node.getURL();
      } else {
        linkUrl = '';
      }
    }
    if ($isEditMode) {
      editedLinkUrl = linkUrl;
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
      const domRect: DOMRect | undefined =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect();
      if (domRect) {
        domRect.y += 40;
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem);
      }
      lastSelection = selection;
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem);
      }
      lastSelection = null;
      $isEditMode = false;
      linkUrl = '';
    }

    return true;
  }

  function monitorInputInteraction(
    event: KeyboardEvent & {currentTarget: EventTarget & HTMLInputElement},
  ) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLinkSubmission();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      $isEditMode = false;
    }
  }

  function handleLinkSubmission() {
    if (lastSelection !== null) {
      if (linkUrl !== '') {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl));
      }
      $isEditMode = false;
    }
  }
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->

<div bind:this={editorRef} class="link-editor">
  {#if $isLink}
    {#if $isEditMode}
      <input
        bind:this={inputRef}
        class="link-input"
        bind:value={editedLinkUrl}
        on:keydown={(event) => {
          monitorInputInteraction(event);
        }} />
      <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="link-cancel"
          role="button"
          tabIndex={0}
          on:mousedown={(event) => event.preventDefault()}
          on:click={() => {
            $isEditMode = false;
          }} />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="link-confirm"
          role="button"
          tabIndex={0}
          on:mousedown={(event) => event.preventDefault()}
          on:click={handleLinkSubmission} />
      </div>
    {:else}
      <div class="link-view">
        <a
          href={sanitizeUrl(linkUrl)}
          target="_blank"
          rel="noopener noreferrer">
          {linkUrl}
        </a>
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-interactive-supports-focus -->
        <div
          class="link-edit"
          role="button"
          tabIndex={0}
          on:mousedown={(event) => event.preventDefault()}
          on:click={() => {
            editedLinkUrl = linkUrl;
            $isEditMode = true;
          }} />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="link-trash"
          role="button"
          tabIndex={0}
          on:mousedown={(event) => event.preventDefault()}
          on:click={() => {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          }} />
      </div>
    {/if}
  {/if}
</div>
