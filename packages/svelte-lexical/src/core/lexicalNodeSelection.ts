import {$createNodeSelection, $getNodeByKey, $getSelection, $isNodeSelection, $setSelection} from "lexical";
import type {LexicalEditor, NodeKey} from 'lexical';

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
 * Add or removes from selection. If existing selection needs to be cleared, call `clearEditorSelection` method before calling `setEditorSelection`.
 */
export function setEditorSelection(editor: LexicalEditor, nodeKey: string, value: boolean) {
  editor.update(() => {
    let selection = $getSelection();

    if (!$isNodeSelection(selection)) {
      selection = $createNodeSelection();
      $setSelection(selection);
    }

    if (value) {
      selection.add(nodeKey);
    } else {
      selection.delete(nodeKey);
    }
  });

}

export function clearEditorSelection(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();

    if ($isNodeSelection(selection)) {
      selection.clear();
    }
  });
}