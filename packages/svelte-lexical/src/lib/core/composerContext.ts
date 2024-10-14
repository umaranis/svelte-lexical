import type {HistoryState} from '@lexical/history';
import type {LexicalEditor} from 'lexical';
import {SvelteComponent, getContext, setContext} from 'svelte';
import {writable,type Writable} from 'svelte/store';

export function getEditor(): LexicalEditor {
  return getContext('editor');
}
/**
 * Save `editor` in the svelte component context
 */
export function setEditor(editor: LexicalEditor): void {
  setContext('editor', editor);
}

export function getIsEditable(): Writable<boolean> {
  return getContext('isEditable');
}

/**
 * Writable store that abstracts {@link LexicalEditor.isEditable} and {@link LexicalEditor.setEditable}.
 */
export function setIsEditable(editor: LexicalEditor): Writable<boolean> {
  const isEditable = writable(editor.isEditable(), (set) => {
    const unsubscribe = editor.registerEditableListener((editable) => {
      set(editable)
    })
    return unsubscribe
  });

  // The overridden `set` method will __not__ update the store's state.
  // Assume that the editor will emit an update to the store's callback at `registerEditableListener.
  isEditable.set = (editable) => {
    editor.setEditable(editable)
  }

  return setContext('isEditable', isEditable)
}

export function getActiveEditor(): Writable<LexicalEditor> {
  return getContext('activeEditor');
}

export function getHistoryStateContext(): HistoryState {
  return getContext('historyState');
}
/**
 * Save `historyState` in the svelte component context
 */
export function setHistoryStateContext(historyState: HistoryState) {
  setContext('historyState', historyState);
}

export type SvelteComponentTypeRef = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentType: typeof SvelteComponent<any>;
  props?: Record<string, object | string | boolean>;
};

/**
 * Editor plugins and decorator nodes don't fall under the same component hierarchy under the composer. They can't share context.
 * This shared context at editor level allows sharing between plugins and decorator nodes.
 */
export function createSharedEditorContext() {
  setContext('editorSharedContext', {});
}

export function getSharedEditorContext(): Record<string, object> {
  return getContext('editorSharedContext');
}

export function setImageHistoryPluginType(
  componentTypeRef: SvelteComponentTypeRef,
) {
  getSharedEditorContext().ImageHistoryComponentType = componentTypeRef;
}

export function getImageHistoryPluginType() {
  return getSharedEditorContext()
    .ImageHistoryComponentType as SvelteComponentTypeRef;
}
