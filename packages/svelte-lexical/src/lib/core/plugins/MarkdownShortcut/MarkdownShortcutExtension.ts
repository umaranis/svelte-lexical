import {registerMarkdownShortcuts, type Transformer} from '@lexical/markdown';
import {defineExtension, safeCast} from 'lexical';
import {ALL_TRANSFORMERS} from './transformers.js';

export interface MarkdownShortcutConfig {
  transformers: Array<Transformer>;
}

export const MarkdownShortcutExtension = /*#__PURE__*/ defineExtension({
  config: safeCast<MarkdownShortcutConfig>({transformers: ALL_TRANSFORMERS}),
  name: '@svelte-lexical/MarkdownShortcut',
  register: (editor, {transformers}) =>
    registerMarkdownShortcuts(editor, transformers),
});
