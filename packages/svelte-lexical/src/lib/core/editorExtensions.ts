// Attributes stored in the Lexical Editor object by svelte-lexical

import type {LexicalEditor} from 'lexical';

declare module 'lexical' {
  interface LexicalEditor {
    extensions: {
      /** InsertImageDialog component must be initialized for the editor to be able to open the dialog. */
      openInsertImageDialog?: () => void;
      /** InsertColumnsDialog component must be initialized for the editor to be able to open the dialog. */
      openInsertColumnsDialog?: () => void;
      /** InsertTableDialog component must be initialized for the editor to be able to open the dialog. */
      openInsertTableDialog?: () => void;
      /** InsertYoutubeDialog component must be initialized for the editor to be able to open the dialog. */
      openInsertYoutubeDialog?: () => void;
      /** InsertTweetDialog component must be initialized for the editor to be able to open the dialog. */
      openInsertTweetDialog?: () => void;
      /** InsertBlueskyDialog component must be initialized for the editor to be able to open the dialog. */
      openInsertBlueskyDialog?: () => void;
    };
  }
}

export function initializeExtensions(editor: LexicalEditor) {
  editor.extensions = {};
}
