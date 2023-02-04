import type {HistoryState} from '@lexical/history';
import type {LexicalEditor} from 'lexical';
import {getContext, setContext} from 'svelte';

const EDITOR_KEY = 'editor';
export function getEditor(): LexicalEditor {
  return getContext(EDITOR_KEY);
}
/**
 * Save `editor` in the svelte component context
 */
export function setEditor(editor: LexicalEditor): void {
  setContext(EDITOR_KEY, editor);
}

const HISTORYSTATE_KEY = 'historyState';
export function getHistoryState(): HistoryState {
  return getContext(HISTORYSTATE_KEY);
}
/**
 * Save `historyState` in the svelte component context
 */
export function setHistoryState(historyState: HistoryState) {
  setContext(HISTORYSTATE_KEY, historyState);
}
