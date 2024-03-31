<script lang="ts">
  import {
    TOGGLE_LINK_COMMAND,
    $isAutoLinkNode as isAutoLinkNode,
    $isLinkNode as isLinkNode,
  } from '@lexical/link';
  import {
    $findMatchingParent as findMatchingParent,
    mergeRegister,
  } from '@lexical/utils';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    COMMAND_PRIORITY_LOW,
    SELECTION_CHANGE_COMMAND,
    $isLineBreakNode as isLineBreakNode,
  } from 'lexical';
  import {writable} from 'svelte/store';
  import {onMount} from 'svelte';
  import getSelectedNode from '../../../components/toolbar/getSelectionInfo';
  import {getEditor} from '../../composerContext';
  import FloatingLinkEditor from './FloatingLinkEditor.svelte';

  const editor = getEditor();
  export let anchorElem = document.body;

  let activeEditor = editor;
  const isLink = writable(false);
  let isEditMode = writable(false);

  function updateToolbar() {
    const selection = getSelection();
    if (isRangeSelection(selection)) {
      const focusNode = getSelectedNode(selection);
      const focusLinkNode = findMatchingParent(focusNode, isLinkNode);
      const focusAutoLinkNode = findMatchingParent(focusNode, isAutoLinkNode);
      if (!(focusLinkNode || focusAutoLinkNode)) {
        $isLink = false;
        return;
      }
      const badNode = selection.getNodes().find((node) => {
        const linkNode = findMatchingParent(node, isLinkNode);
        const autoLinkNode = findMatchingParent(node, isAutoLinkNode);
        if (
          !linkNode?.is(focusLinkNode) &&
          !autoLinkNode?.is(focusAutoLinkNode) &&
          !linkNode &&
          !autoLinkNode &&
          !isLineBreakNode(node)
        ) {
          return node;
        }
      });
      if (!badNode) {
        $isLink = true;
      } else {
        $isLink = false;
      }
    }
  }

  onMount(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          activeEditor = newEditor;
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = getSelection();
          if (isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = findMatchingParent(node, isLinkNode);
            if (isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank');
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (payload) => {
          if (payload === 'https://') {
            $isEditMode = true;
          }
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  });
</script>

<FloatingLinkEditor editor={activeEditor} {isLink} {anchorElem} {isEditMode} />
