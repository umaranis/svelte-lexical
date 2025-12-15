import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  type LexicalEditor,
} from 'lexical';
import {ComponentPickerOption} from './ComponentPickerOption.js';
import {$setBlocksType} from '@lexical/selection';
import {$createHeadingNode, $createQuoteNode} from '@lexical/rich-text';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import {$createCodeNode} from '@lexical/code';
import {INSERT_HORIZONTAL_RULE_COMMAND} from '../HorizontalRuleNode.js';
import {INSERT_TABLE_COMMAND} from '@lexical/table';

export function getBaseOptions(
  editor: LexicalEditor /*, showModal: ShowModal */,
) {
  return [
    new ComponentPickerOption('Paragraph', {
      icon: 'icon paragraph',
      keywords: ['normal', 'paragraph', 'p', 'text'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),
    ...([1, 2, 3] as const).map(
      (n) =>
        new ComponentPickerOption(`Heading ${n}`, {
          icon: `icon h${n}`,
          keywords: ['heading', 'header', `h${n}`],
          onSelect: () =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
              }
            }),
        }),
    ),
    new ComponentPickerOption('Table', {
      icon: 'icon table',
      keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns'],
      onSelect: () => editor.extensions.openInsertTableDialog!(),
    }),
    new ComponentPickerOption('Numbered List', {
      icon: 'icon number',
      keywords: ['numbered list', 'ordered list', 'ol'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Bulleted List', {
      icon: 'icon bullet',
      keywords: ['bulleted list', 'unordered list', 'ul'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Check List', {
      icon: 'icon check',
      keywords: ['check list', 'todo list'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption('Quote', {
      icon: 'icon quote',
      keywords: ['block quote'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
    }),
    new ComponentPickerOption('Code', {
      icon: 'icon code',
      keywords: ['javascript', 'python', 'js', 'codeblock'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              // Will this ever happen?
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection.insertRawText(textContent);
            }
          }
        }),
    }),
    new ComponentPickerOption('Divider', {
      icon: 'icon horizontal-rule',
      keywords: ['horizontal rule', 'divider', 'hr'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),
    // new ComponentPickerOption('Page Break', {
    //   icon: "icon page-break",
    //   keywords: ['page break', 'divider'],
    //   onSelect: () => editor.dispatchCommand(INSERT_PAGE_BREAK, undefined),
    // }),
    // new ComponentPickerOption('Excalidraw', {
    //   icon: "icon diagram-2",
    //   keywords: ['excalidraw', 'diagram', 'drawing'],
    //   onSelect: () =>
    //     editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined),
    // }),
    // new ComponentPickerOption('Poll', {
    //   icon: "icon poll",
    //   keywords: ['poll', 'vote'],
    //   onSelect: () =>
    //     showModal('Insert Poll', (onClose) => (
    //       <InsertPollDialog activeEditor={editor} onClose={onClose} />
    //     )),
    // }),
    // ...EmbedConfigs.map(
    //   (embedConfig) =>
    //     new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
    //       icon: embedConfig.icon,
    //       keywords: [...embedConfig.keywords, 'embed'],
    //       onSelect: () =>
    //         editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
    //     }),
    // ),
    // // new ComponentPickerOption('Date', {
    // //   icon: "icon calendar",
    // //   keywords: ['date', 'calendar', 'time'],
    // //   onSelect: () => {
    // //     const dateTime = new Date();
    // //     dateTime.setHours(0, 0, 0, 0); // Set time to midnight
    // //     editor.dispatchCommand(INSERT_DATETIME_COMMAND, {dateTime});
    // //   },
    // // }),
    // new ComponentPickerOption('Today', {
    //   icon: "icon calendar",
    //   keywords: ['date', 'calendar', 'time', 'today'],
    //   onSelect: () => {
    //     const dateTime = new Date();
    //     dateTime.setHours(0, 0, 0, 0); // Set time to midnight
    //     editor.dispatchCommand(INSERT_DATETIME_COMMAND, {dateTime});
    //   },
    // }),
    // new ComponentPickerOption('Tomorrow', {
    //   icon: "icon calendar",
    //   keywords: ['date', 'calendar', 'time', 'tomorrow'],
    //   onSelect: () => {
    //     const dateTime = new Date();
    //     dateTime.setDate(dateTime.getDate() + 1);
    //     dateTime.setHours(0, 0, 0, 0); // Set time to midnight
    //     editor.dispatchCommand(INSERT_DATETIME_COMMAND, {dateTime});
    //   },
    // }),
    // new ComponentPickerOption('Yesterday', {
    //   icon: "icon calendar",
    //   keywords: ['date', 'calendar', 'time', 'yesterday'],
    //   onSelect: () => {
    //     const dateTime = new Date();
    //     dateTime.setDate(dateTime.getDate() - 1);
    //     dateTime.setHours(0, 0, 0, 0); // Set time to midnight
    //     editor.dispatchCommand(INSERT_DATETIME_COMMAND, {dateTime});
    //   },
    // }),
    // new ComponentPickerOption('Equation', {
    //   icon: "icon equation",
    //   keywords: ['equation', 'latex', 'math'],
    //   onSelect: () =>
    //     showModal('Insert Equation', (onClose) => (
    //       <InsertEquationDialog activeEditor={editor} onClose={onClose} />
    //     )),
    // }),
    // new ComponentPickerOption('GIF', {
    //   icon: "icon gif",
    //   keywords: ['gif', 'animate', 'image', 'file'],
    //   onSelect: () =>
    //     editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
    //       altText: 'Cat typing on a laptop',
    //       src: catTypingGif,
    //     }),
    // }),
    // new ComponentPickerOption('Image', {
    //   icon: "icon image",
    //   keywords: ['image', 'photo', 'picture', 'file'],
    //   onSelect: () =>
    //     showModal('Insert Image', (onClose) => (
    //       <InsertImageDialog activeEditor={editor} onClose={onClose} />
    //     )),
    // }),
    // new ComponentPickerOption('Collapsible', {
    //   icon: "icon caret-right",
    //   keywords: ['collapse', 'collapsible', 'toggle'],
    //   onSelect: () =>
    //     editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined),
    // }),
    // new ComponentPickerOption('Columns Layout', {
    //   icon: "icon columns",
    //   keywords: ['columns', 'layout', 'grid'],
    //   onSelect: () =>
    //     showModal('Insert Columns Layout', (onClose) => (
    //       <InsertLayoutDialog activeEditor={editor} onClose={onClose} />
    //     )),
    // }),
    ...(['left', 'center', 'right', 'justify'] as const).map(
      (alignment) =>
        new ComponentPickerOption(`Align ${alignment}`, {
          icon: 'icon ' + alignment + '-align',
          keywords: ['align', 'justify', alignment],
          onSelect: () =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
        }),
    ),
  ];
}

export function getDynamicOptions(editor: LexicalEditor, queryString: string) {
  const options: Array<ComponentPickerOption> = [];

  if (queryString == null) {
    return options;
  }

  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2]
      ? [tableMatch[2]]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: 'icon table',
            keywords: ['table'],
            onSelect: () =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, {columns, rows}),
          }),
      ),
    );
  }

  return options;
}
