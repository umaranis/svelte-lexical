import {$setBlocksType} from '@lexical/selection';
import {$createParagraphNode, $getSelection, type LexicalEditor} from 'lexical';

export function formatParagraph(editor: LexicalEditor) {
  editor.update(() => {
    const selection = $getSelection();
    $setBlocksType(selection, () => $createParagraphNode());
  });
}
