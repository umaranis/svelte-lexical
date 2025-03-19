import {FORMAT_TEXT_COMMAND, type LexicalEditor} from 'lexical';

export function toggleBold(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
}
