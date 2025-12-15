// Attributes stored in the Lexical Editor object by svelte-lexical

import type {LexicalEditor} from 'lexical';

declare module 'lexical' {
  interface LexicalEditor {
    extensions: {
      /** InsertImageDialog component must be initialized for the editor to be able to open the dialog. */
      openInsertImageDialog?: () => void;
    };
  }
}

export function initializeExtensions(editor: LexicalEditor) {
  editor.extensions = {};
}
