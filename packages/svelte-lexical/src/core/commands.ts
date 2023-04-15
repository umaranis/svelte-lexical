import type {ImagePayload} from './plugins/Image/ImageNode';
import {INSERT_IMAGE_COMMAND} from './plugins/Image/ImagePlugin.svelte';
import type {LexicalEditor} from 'lexical';

const commands = {
  InsertImage: {
    execute: (editor: LexicalEditor, payload: ImagePayload) => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    },
  },
};

export function getCommands() {
  return commands;
}
