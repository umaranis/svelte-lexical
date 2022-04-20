import {
  $handleListInsertParagraph,
  indentList,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  insertList,
  outdentList,
  REMOVE_LIST_COMMAND,
  removeList,
} from '@lexical/list';  
import {    
  INDENT_CONTENT_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';

export function registerListCommands(editor) {
  const COMMAND_PRIORITY_LOW = 1;

  editor.registerCommand(
    INDENT_CONTENT_COMMAND,
    () => {
      const hasHandledIndention = indentList();
      if (hasHandledIndention) {
        return true;
      }
      return false;
    },
    COMMAND_PRIORITY_LOW,
  );
  editor.registerCommand(
    OUTDENT_CONTENT_COMMAND,
    () => {
      const hasHandledIndention = outdentList();
      if (hasHandledIndention) {
        return true;
      }
      return false;
    },
    COMMAND_PRIORITY_LOW,
  );
  editor.registerCommand(
    INSERT_ORDERED_LIST_COMMAND,
    () => {
      insertList(editor, 'ol');
      return true;
    },
    COMMAND_PRIORITY_LOW,
  );
  editor.registerCommand(
    INSERT_UNORDERED_LIST_COMMAND,
    () => {
      insertList(editor, 'ul');
      return true;
    },
    COMMAND_PRIORITY_LOW,
  );
  editor.registerCommand(
    REMOVE_LIST_COMMAND,
    () => {
      removeList(editor);
      return true;
    },
    COMMAND_PRIORITY_LOW,
  );
  editor.registerCommand(
    INSERT_PARAGRAPH_COMMAND,
    () => {
      const hasHandledInsertParagraph = $handleListInsertParagraph();
      if (hasHandledInsertParagraph) {
        return true;
      }
      return false;
    },
    COMMAND_PRIORITY_LOW,
  );
}