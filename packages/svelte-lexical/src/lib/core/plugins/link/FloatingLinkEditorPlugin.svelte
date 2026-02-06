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
    $isNodeSelection as isNodeSelection,
  } from 'lexical';
  import {writable} from 'svelte/store';
  import {onMount} from 'svelte';
  import getSelectedNode from '../../../components/toolbar/getSelectionInfo.js';
  import {getEditor} from '../../composerContext.js';
  import FloatingLinkEditor from './FloatingLinkEditor.svelte';

  const editor = getEditor();
  let {anchorElem = document.body} = $props();

  let activeEditor = $state(editor);
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
      const badNode = selection
        .getNodes()
        .filter((node) => !isLineBreakNode(node))
        .find((node) => {
          const linkNode = findMatchingParent(node, isLinkNode);
          const autoLinkNode = findMatchingParent(node, isAutoLinkNode);
          return (
            (focusLinkNode && !focusLinkNode.is(linkNode)) ||
            (linkNode && !linkNode.is(focusLinkNode)) ||
            (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
            (autoLinkNode &&
              (!autoLinkNode.is(focusAutoLinkNode) ||
                autoLinkNode.getIsUnlinked()))
          );
        });
      if (!badNode) {
        $isLink = true;
      } else {
        $isLink = false;
      }
    } else if (isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length === 0) {
        $isLink = false;
        return;
      }
      const node = nodes[0];
      const parent = node.getParent();
      if (isLinkNode(parent) || isLinkNode(node)) {
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
