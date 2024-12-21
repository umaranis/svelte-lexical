<script lang="ts">
  import {run} from 'svelte/legacy';

  import './FloatingLinkEditor.css';
  import {
    $isLinkNode as isLinkNode,
    $isAutoLinkNode as isAutoLinkNode,
    TOGGLE_LINK_COMMAND,
    $createLinkNode as createLinkNode,
  } from '@lexical/link';
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
    type LexicalEditor,
    type BaseSelection,
  } from 'lexical';
  import {onMount} from 'svelte';
  import type {Writable} from 'svelte/store';
  import getSelectedNode from '../../../components/toolbar/getSelectionInfo.js';
  import {setFloatingElemPositionForLinkEditor} from './setFloatingElemPositionForLinkEditor.js';
  import {sanitizeUrl} from './url.js';

  let editorRef: HTMLDivElement;
  let inputRef: HTMLInputElement | undefined = $state();
  let linkUrl = $state('');
  let editedLinkUrl = $state('');
  interface Props {
    editor: LexicalEditor;
    isLink: Writable<boolean>;
    anchorElem: HTMLElement;
    isEditMode: Writable<boolean>;
  }

  let {editor, isLink, anchorElem, isEditMode}: Props = $props();
  let lastSelection: BaseSelection | null = null;

  run(() => {
    if ($isEditMode && inputRef) {
      inputRef.focus();
    }
  });

  run(() => {
    if (anchorElem && editorRef) {
      anchorElem.appendChild(editorRef as Node);
    }
  });

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
        editor.update(() => {
          const selection = getSelection();
          if (isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent();
            if (isAutoLinkNode(parent)) {
              const linkNode = createLinkNode(parent.getURL(), {
                rel: parent.__rel,
                target: parent.__target,
                title: parent.__title,
              });
              parent.replace(linkNode, true);
            }
          }
        });
      }
      $isEditMode = false;
    }
  }
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->

<div bind:this={editorRef} class="link-editor">
  {#if $isLink}
    {#if $isEditMode}
      <input
        bind:this={inputRef}
        class="link-input"
        bind:value={editedLinkUrl}
        onkeydown={(event) => {
          monitorInputInteraction(event);
        }} />
      <div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="link-cancel"
          role="button"
          tabIndex={0}
          onmousedown={(event) => event.preventDefault()}
          onclick={() => {
            $isEditMode = false;
          }}>
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="link-confirm"
          role="button"
          tabIndex={0}
          onmousedown={(event) => event.preventDefault()}
          onclick={handleLinkSubmission}>
        </div>
      </div>
    {:else}
      <div class="link-view">
        <a
          href={sanitizeUrl(linkUrl)}
          target="_blank"
          rel="noopener noreferrer">
          {linkUrl}
        </a>
        <!-- svelte-ignore a11y_interactive_supports_focus -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="link-edit"
          role="button"
          tabIndex={0}
          onmousedown={(event) => event.preventDefault()}
          onclick={() => {
            editedLinkUrl = linkUrl;
            $isEditMode = true;
          }}>
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div
          class="link-trash"
          role="button"
          tabIndex={0}
          onmousedown={(event) => event.preventDefault()}
          onclick={() => {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          }}>
        </div>
      </div>
    {/if}
  {/if}
</div>
