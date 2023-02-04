import type {LexicalEditor} from 'lexical';
import {getContext} from 'svelte';

export function getEditor(): LexicalEditor {
  return getContext('editor');
}
