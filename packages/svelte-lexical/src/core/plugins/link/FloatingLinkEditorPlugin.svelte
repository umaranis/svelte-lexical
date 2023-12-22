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
    COMMAND_PRIORITY_CRITICAL,
    SELECTION_CHANGE_COMMAND,
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
      const node = getSelectedNode(selection);
      const linkParent = findMatchingParent(node, isLinkNode);
      const autoLinkParent = findMatchingParent(node, isAutoLinkNode);

      // We don't want this menu to open for auto links.
      if (linkParent != null && autoLinkParent == null) {
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
