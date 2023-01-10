/**
 * Ported from lexical/packages/lexical-react/src/useLexicalNodeSelection.ts
 */

import {
  $createNodeSelection,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
} from 'lexical';
import type {LexicalEditor, NodeKey} from 'lexical';
import {writable} from 'svelte/store';

export function isNodeSelected(editor: LexicalEditor, key: NodeKey): boolean {
  return editor.getEditorState().read(() => {
    const node = $getNodeByKey(key);

    if (node === null) {
      return false;
    }

    return node.isSelected();
  });
}

/**
 * Clear editor selection
 */
export function clearSelection(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();

    if ($isNodeSelection(selection)) {
      selection.clear();
    }
  });
}

/**
 * Stores `isSelected` state for a SvelteComponent node.
 * Rather than updating the component state directly, it updates the editor node selection and receives updates from the editor.
 */
export function createNodeSelectionStore(
  editor: LexicalEditor,
  nodeKey: string,
) {
  const {subscribe, set /*, update*/} = writable(false);

  editor.registerUpdateListener(() => {
    set(isNodeSelected(editor, nodeKey));
  });

  return {
    subscribe,
    set: (selected: boolean) => {
      editor.update(() => {
        let selection = $getSelection();

        if (!$isNodeSelection(selection)) {
          selection = $createNodeSelection();
          $setSelection(selection);
        }

        if (selected) {
          selection.add(nodeKey);
        } else {
          selection.delete(nodeKey);
        }
      });
    },
  };
}
