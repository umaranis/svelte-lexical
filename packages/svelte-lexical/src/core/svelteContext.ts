import type {HistoryState} from '@lexical/history';
import type {LexicalEditor} from 'lexical';
import {getContext, setContext} from 'svelte';
import type {Writable} from 'svelte/store';

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
