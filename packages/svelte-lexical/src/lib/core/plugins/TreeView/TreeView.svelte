<script lang="ts">
  import {run} from 'svelte/legacy';

  import type {
    BaseSelection,
    EditorState,
    ElementNode,
    LexicalCommand,
    LexicalEditor,
    LexicalNode,
    ParagraphNode,
    RangeSelection,
    TextNode,
  } from 'lexical';

  import {$generateHtmlFromNodes as generateHtmlFromNodes} from '@lexical/html';
  import {$isLinkNode as isLinkNode, LinkNode} from '@lexical/link';
  import {$isMarkNode as isMarkNode} from '@lexical/mark';
  import {mergeRegister} from '@lexical/utils';
  import {
    $getRoot as getRoot,
    $getSelection as getSelection,
    $isElementNode as isElementNode,
    $isRangeSelection as isRangeSelection,
    $isTextNode as isTextNode,
    $isNodeSelection as isNodeSelection,
    $isParagraphNode as isParagraphNode,
  } from 'lexical';
  import {
    $isTableSelection as isTableSelection,
    type TableSelection,
  } from '@lexical/table';
  import {onMount} from 'svelte';
  import {getEditor} from '../../composerContext.js';
  import CommandsLog from './CommandsLog.svelte';

  const NON_SINGLE_WIDTH_CHARS_REPLACEMENT: Readonly<Record<string, string>> =
    Object.freeze({
      '\t': '\\t',
      '\n': '\\n',
    });
  const NON_SINGLE_WIDTH_CHARS_REGEX = new RegExp(
    Object.keys(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).join('|'),
    'g',
  );
  const SYMBOLS: Record<string, string> = Object.freeze({
    ancestorHasNextSibling: '|',
    ancestorIsLastChild: ' ',
    hasNextSibling: '├',
    isLastChild: '└',
    selectedChar: '^',
    selectedLine: '>',
  });

  interface Props {
    treeTypeButtonClassName?: string;
    timeTravelButtonClassName?: string;
    timeTravelPanelButtonClassName?: string;
    timeTravelPanelClassName?: string;
    timeTravelPanelSliderClassName?: string;
    viewClassName?: string;
  }

  let {
    treeTypeButtonClassName,
    timeTravelButtonClassName,
    timeTravelPanelButtonClassName,
    timeTravelPanelClassName,
    timeTravelPanelSliderClassName,
    viewClassName,
  }: Props = $props();

  const editor: LexicalEditor = getEditor();

  let timeStampedEditorStates: Array<[number, EditorState]> = $state([]);
  let content = $state('');
  let timeTravelEnabled = $state(false);
  let showExportDOM = $state(false);
  let playingIndexRef = $state(0);
  let treeElementRef: HTMLElement | null = $state(null);
  let inputRef: HTMLInputElement | null = $state(null);
  let isPlaying = $state(false);
  let isLimited = $state(false);
  let showLimited = $state(false);
  let lastEditorStateRef: EditorState | null = $state(null);

  let commandsLog: ReadonlyArray<
    {index: number} & LexicalCommand<unknown> & {payload: unknown}
  > = $state([]);

  function generateTree(editorState: EditorState) {
    const treeText = generateContent(editor, commandsLog, showExportDOM);

    content = treeText;

    if (!timeTravelEnabled) {
      timeStampedEditorStates = [
        ...timeStampedEditorStates,
        [Date.now(), editorState],
      ];
    }
  }

  let timeoutId: ReturnType<typeof setTimeout>;

  function play() {
    const currentIndex = playingIndexRef;

    if (currentIndex === totalEditorStates - 1) {
      isPlaying = false;
      return;
    }

    const currentTime = timeStampedEditorStates[currentIndex][0];
    const nextTime = timeStampedEditorStates[currentIndex + 1][0];
    const timeDiff = nextTime - currentTime;
    timeoutId = setTimeout(() => {
      playingIndexRef++;
      const index = playingIndexRef;
      const input = inputRef;

      if (input !== null) {
        input.value = String(index);
      }

      editor.setEditorState(timeStampedEditorStates[index][1]);
      play();
    }, timeDiff);
  }

  onMount(() => {
    const element = treeElementRef;
    if (element !== null) {
      // @ts-ignore Internal field
      element.__lexicalEditor = editor;
    }

    return mergeRegister(
      // @ts-ignore Internal field
      () => (treeElementRef.__lexicalEditor = null),
      editor.registerUpdateListener(({editorState}) => {
        if (!showLimited && editorState._nodeMap.size > 1000) {
          lastEditorStateRef = editorState;
          isLimited = true;
          if (!showLimited) {
            return;
          }
        }
        generateTree(editorState);
      }),
      editor.registerEditableListener(() => {
        const treeText = generateContent(editor, commandsLog, showExportDOM);
        content = treeText;
      }),
    );
  });

  function printRangeSelection(selection: RangeSelection): string {
    let res = '';

    const formatText = printFormatProperties(selection);

    res += `: range ${formatText !== '' ? `{ ${formatText} }` : ''} ${
      selection.style !== '' ? `{ style: ${selection.style} } ` : ''
    }`;

    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorOffset = anchor.offset;
    const focusOffset = focus.offset;

    res += `\n  ├ anchor { key: ${anchor.key}, offset: ${
      anchorOffset === null ? 'null' : anchorOffset
    }, type: ${anchor.type} }`;
    res += `\n  └ focus { key: ${focus.key}, offset: ${
      focusOffset === null ? 'null' : focusOffset
    }, type: ${focus.type} }`;

    return res;
  }

  function printNodeSelection(selection: BaseSelection): string {
    if (!isNodeSelection(selection)) return '';
    return `: node\n  └ [${Array.from(selection._nodes).join(', ')}]`;
  }

  function printTableSelection(selection: TableSelection): string {
    return `: table\n  └ { table: ${selection.tableKey}, anchorCell: ${selection.anchor.key}, focusCell: ${selection.focus.key} }`;
  }

  function generateContent(
    editor: LexicalEditor,
    commandsLog: ReadonlyArray<
      {index: number} & LexicalCommand<unknown> & {payload: unknown}
    >,
    exportDOM: boolean,
  ): string {
    const editorState = editor.getEditorState();
    const editorConfig = editor._config;
    const compositionKey = editor._compositionKey;
    const editable = editor._editable;

    if (exportDOM) {
      let htmlString = '';
      editorState.read(() => {
        htmlString = printPrettyHTML(generateHtmlFromNodes(editor));
      });
      return htmlString;
    }

    let res = ' root\n';

    const selectionString = editorState.read(() => {
      const selection = getSelection();

      visitTree(getRoot(), (node: LexicalNode, indent: Array<string>) => {
        const nodeKey = node.getKey();
        const nodeKeyDisplay = `(${nodeKey})`;
        const typeDisplay = node.getType() || '';
        const isSelected = node.isSelected();

        res += `${isSelected ? SYMBOLS.selectedLine : ' '} ${indent.join(
          ' ',
        )} ${nodeKeyDisplay} ${typeDisplay} ${printNode(node)}\n`;

        res += printSelectedCharsLine({
          indent,
          isSelected,
          node,
          nodeKeyDisplay,
          selection,
          typeDisplay,
        });
      });

      return selection === null
        ? ': null'
        : isRangeSelection(selection)
          ? printRangeSelection(selection)
          : isTableSelection(selection)
            ? printTableSelection(selection)
            : printNodeSelection(selection);
    });

    res += '\n selection' + selectionString;

    res += '\n\n commands:';

    if (commandsLog && commandsLog.length) {
      for (const {index, type, payload} of commandsLog) {
        res += `\n  └ ${index}. { type: ${type}, payload: ${
          payload instanceof Event ? payload.constructor.name : payload
        } }`;
      }
    } else {
      res += '\n  └ None dispatched.';
    }

    res += '\n\n editor:';
    res += `\n  └ namespace ${editorConfig.namespace}`;
    if (compositionKey !== null) {
      res += `\n  └ compositionKey ${compositionKey}`;
    }
    res += `\n  └ editable ${String(editable)}`;

    return res;
  }

  function visitTree(
    currentNode: ElementNode,
    visitor: (node: LexicalNode, indentArr: Array<string>) => void,
    indent: Array<string> = [],
  ) {
    const childNodes = currentNode.getChildren();
    const childNodesLength = childNodes.length;

    childNodes.forEach((childNode, i) => {
      visitor(
        childNode,
        indent.concat(
          i === childNodesLength - 1
            ? SYMBOLS.isLastChild
            : SYMBOLS.hasNextSibling,
        ),
      );

      if (isElementNode(childNode)) {
        visitTree(
          childNode,
          visitor,
          indent.concat(
            i === childNodesLength - 1
              ? SYMBOLS.ancestorIsLastChild
              : SYMBOLS.ancestorHasNextSibling,
          ),
        );
      }
    });
  }

  function normalize(text: string) {
    return Object.entries(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(key, 'g'), String(value)),
      text,
    );
  }

  // TODO Pass via props to allow customizability
  function printNode(node: LexicalNode) {
    if (isTextNode(node)) {
      const text = node.getTextContent();
      const title = text.length === 0 ? '(empty)' : `"${normalize(text)}"`;
      const properties = printAllTextNodeProperties(node);
      return [title, properties.length !== 0 ? `{ ${properties} }` : null]
        .filter(Boolean)
        .join(' ')
        .trim();
    } else if (isLinkNode(node)) {
      const link = node.getURL();
      const title = link.length === 0 ? '(empty)' : `"${normalize(link)}"`;
      const properties = printAllLinkNodeProperties(node);
      return [title, properties.length !== 0 ? `{ ${properties} }` : null]
        .filter(Boolean)
        .join(' ')
        .trim();
    } else if (isMarkNode(node)) {
      return `ids: [ ${node.getIDs().join(', ')} ]`;
    } else if (isParagraphNode(node)) {
      const formatText = printTextFormatProperties(node);
      return formatText !== '' ? `{ ${formatText} }` : '';
    } else {
      return '';
    }
  }

  const FORMAT_PREDICATES = [
    (node: TextNode | RangeSelection) => node.hasFormat('bold') && 'Bold',
    (node: TextNode | RangeSelection) => node.hasFormat('code') && 'Code',
    (node: TextNode | RangeSelection) => node.hasFormat('italic') && 'Italic',
    (node: TextNode | RangeSelection) =>
      node.hasFormat('strikethrough') && 'Strikethrough',
    (node: TextNode | RangeSelection) =>
      node.hasFormat('subscript') && 'Subscript',
    (node: TextNode | RangeSelection) =>
      node.hasFormat('superscript') && 'Superscript',
    (node: TextNode | RangeSelection) =>
      node.hasFormat('underline') && 'Underline',
  ];

  const FORMAT_PREDICATES_PARAGRAPH = [
    (node: ParagraphNode) => node.hasTextFormat('bold') && 'Bold',
    (node: ParagraphNode) => node.hasTextFormat('code') && 'Code',
    (node: ParagraphNode) => node.hasTextFormat('italic') && 'Italic',
    (node: ParagraphNode) =>
      node.hasTextFormat('strikethrough') && 'Strikethrough',
    (node: ParagraphNode) => node.hasTextFormat('subscript') && 'Subscript',
    (node: ParagraphNode) => node.hasTextFormat('superscript') && 'Superscript',
    (node: ParagraphNode) => node.hasTextFormat('underline') && 'Underline',
  ];

  const DETAIL_PREDICATES = [
    (node: TextNode) => node.isDirectionless() && 'Directionless',
    (node: TextNode) => node.isUnmergeable() && 'Unmergeable',
  ];

  const MODE_PREDICATES = [
    (node: TextNode) => node.isToken() && 'Token',
    (node: TextNode) => node.isSegmented() && 'Segmented',
  ];

  function printAllTextNodeProperties(node: TextNode) {
    return [
      printFormatProperties(node),
      printDetailProperties(node),
      printModeProperties(node),
    ]
      .filter(Boolean)
      .join(', ');
  }

  function printAllLinkNodeProperties(node: LinkNode) {
    return [
      printTargetProperties(node),
      printRelProperties(node),
      printTitleProperties(node),
    ]
      .filter(Boolean)
      .join(', ');
  }

  function printDetailProperties(nodeOrSelection: TextNode) {
    let str = DETAIL_PREDICATES.map((predicate) => predicate(nodeOrSelection))
      .filter(Boolean)
      .join(', ')
      .toLocaleLowerCase();

    if (str !== '') {
      str = 'detail: ' + str;
    }

    return str;
  }

  function printModeProperties(nodeOrSelection: TextNode) {
    let str = MODE_PREDICATES.map((predicate) => predicate(nodeOrSelection))
      .filter(Boolean)
      .join(', ')
      .toLocaleLowerCase();

    if (str !== '') {
      str = 'mode: ' + str;
    }

    return str;
  }

  function printTextFormatProperties(nodeOrSelection: ParagraphNode) {
    let str = FORMAT_PREDICATES_PARAGRAPH.map((predicate) =>
      predicate(nodeOrSelection),
    )
      .filter(Boolean)
      .join(', ')
      .toLocaleLowerCase();

    if (str !== '') {
      str = 'format: ' + str;
    }

    return str;
  }

  function printFormatProperties(nodeOrSelection: TextNode | RangeSelection) {
    let str = FORMAT_PREDICATES.map((predicate) => predicate(nodeOrSelection))
      .filter(Boolean)
      .join(', ')
      .toLocaleLowerCase();

    if (str !== '') {
      str = 'format: ' + str;
    }

    return str;
  }

  function printTargetProperties(node: LinkNode) {
    let str = node.getTarget();
    // TODO Fix nullish on LinkNode
    if (str != null) {
      str = 'target: ' + str;
    }
    return str;
  }

  function printRelProperties(node: LinkNode) {
    let str = node.getRel();
    // TODO Fix nullish on LinkNode
    if (str != null) {
      str = 'rel: ' + str;
    }
    return str;
  }

  function printTitleProperties(node: LinkNode) {
    let str = node.getTitle();
    // TODO Fix nullish on LinkNode
    if (str != null) {
      str = 'title: ' + str;
    }
    return str;
  }

  function printSelectedCharsLine({
    indent,
    isSelected,
    node,
    nodeKeyDisplay,
    selection,
    typeDisplay,
  }: {
    indent: Array<string>;
    isSelected: boolean;
    node: LexicalNode;
    nodeKeyDisplay: string;
    selection: BaseSelection | null;
    typeDisplay: string;
  }) {
    // No selection or node is not selected.
    if (
      !isTextNode(node) ||
      !isRangeSelection(selection) ||
      !isSelected ||
      isElementNode(node)
    ) {
      return '';
    }

    // No selected characters.
    const anchor = selection.anchor;
    const focus = selection.focus;

    if (
      node.getTextContent() === '' ||
      (anchor.getNode() === selection.focus.getNode() &&
        anchor.offset === focus.offset)
    ) {
      return '';
    }

    const [start, end] = getSelectionStartEnd(node, selection);

    if (start === end) {
      return '';
    }

    const selectionLastIndent =
      indent[indent.length - 1] === SYMBOLS.hasNextSibling
        ? SYMBOLS.ancestorHasNextSibling
        : SYMBOLS.ancestorIsLastChild;

    const indentionChars = [
      ...indent.slice(0, indent.length - 1),
      selectionLastIndent,
    ];
    const unselectedChars = Array(start + 1).fill(' ');
    const selectedChars = Array(end - start).fill(SYMBOLS.selectedChar);
    const paddingLength = typeDisplay.length + 2; // 1 for the space after + 1 for the double quote.

    const nodePrintSpaces = Array(nodeKeyDisplay.length + paddingLength).fill(
      ' ',
    );

    return (
      [
        SYMBOLS.selectedLine,
        indentionChars.join(' '),
        [...nodePrintSpaces, ...unselectedChars, ...selectedChars].join(''),
      ].join(' ') + '\n'
    );
  }

  function printPrettyHTML(str: string) {
    const div = document.createElement('div');
    div.innerHTML = str.trim();
    return prettifyHTML(div, 0).innerHTML;
  }

  function prettifyHTML(node: Element, level: number) {
    const indentBefore = new Array(level++ + 1).join('  ');
    const indentAfter = new Array(level - 1).join('  ');
    let textNode;

    for (let i = 0; i < node.children.length; i++) {
      textNode = document.createTextNode('\n' + indentBefore);
      node.insertBefore(textNode, node.children[i]);
      prettifyHTML(node.children[i], level);
      if (node.lastElementChild === node.children[i]) {
        textNode = document.createTextNode('\n' + indentAfter);
        node.appendChild(textNode);
      }
    }

    return node;
  }

  function getSelectionStartEnd(
    node: LexicalNode,
    selection: BaseSelection,
  ): [number, number] {
    const anchorAndFocus = selection.getStartEndPoints();
    if (isNodeSelection(selection) || anchorAndFocus === null) {
      return [-1, -1];
    }
    const [anchor, focus] = anchorAndFocus;
    const textContent = node.getTextContent();
    const textLength = textContent.length;

    let start = -1;
    let end = -1;

    // Only one node is being selected.
    if (anchor.type === 'text' && focus.type === 'text') {
      const anchorNode = anchor.getNode();
      const focusNode = focus.getNode();

      if (
        anchorNode === focusNode &&
        node === anchorNode &&
        anchor.offset !== focus.offset
      ) {
        [start, end] =
          anchor.offset < focus.offset
            ? [anchor.offset, focus.offset]
            : [focus.offset, anchor.offset];
      } else if (node === anchorNode) {
        [start, end] = anchorNode.isBefore(focusNode)
          ? [anchor.offset, textLength]
          : [0, anchor.offset];
      } else if (node === focusNode) {
        [start, end] = focusNode.isBefore(anchorNode)
          ? [focus.offset, textLength]
          : [0, focus.offset];
      } else {
        // Node is within selection but not the anchor nor focus.
        [start, end] = [0, textLength];
      }
    }

    // Account for non-single width characters.
    const numNonSingleWidthCharBeforeSelection = (
      textContent.slice(0, start).match(NON_SINGLE_WIDTH_CHARS_REGEX) || []
    ).length;
    const numNonSingleWidthCharInSelection = (
      textContent.slice(start, end).match(NON_SINGLE_WIDTH_CHARS_REGEX) || []
    ).length;

    return [
      start + numNonSingleWidthCharBeforeSelection,
      end +
        numNonSingleWidthCharBeforeSelection +
        numNonSingleWidthCharInSelection,
    ];
  }
  run(() => {
    const editorState = editor.getEditorState();
    if (!showLimited && editorState._nodeMap.size > 1) {
      content = generateContent(editor, commandsLog, showExportDOM);
    }
  });
  let totalEditorStates = $derived(timeStampedEditorStates.length);
  run(() => {
    if (isPlaying) {
      play();
    }
  });
  run(() => {
    if (!isPlaying) {
      clearInterval(timeoutId);
    }
  });
</script>

<CommandsLog bind:loggedCommands={commandsLog} />
<div class={viewClassName}>
  {#if !showLimited && isLimited}
    <div style="padding: 20px">
      <span style="margin-right: 20px">
        Detected large EditorState, this can impact debugging performance.
      </span>
      <button
        type="button"
        onclick={() => {
          showLimited = true;
          const editorState = lastEditorStateRef;
          if (editorState !== null) {
            lastEditorStateRef = null;
            generateTree(editorState);
          }
        }}
        style="
          background: transparent;
          border: 1px solid white;
          color: white;
          cursor: pointer;
          padding: 5px;
        ">
        Show full tree
      </button>
    </div>
  {/if}
  {#if !showLimited}
    <button
      onclick={() => (showExportDOM = !showExportDOM)}
      class={treeTypeButtonClassName}
      type="button">
      {showExportDOM ? 'Tree' : 'Export DOM'}
    </button>
  {/if}
  {#if !timeTravelEnabled && (showLimited || !isLimited) && totalEditorStates > 2}
    <button
      onclick={() => {
        const rootElement = editor.getRootElement();

        if (rootElement !== null) {
          rootElement.contentEditable = 'false';
          playingIndexRef = totalEditorStates - 1;
          timeTravelEnabled = true;
        }
      }}
      class={timeTravelButtonClassName}
      type="button">
      Time Travel
    </button>
  {/if}
  {#if showLimited || !isLimited}
    <pre bind:this={treeElementRef}>{content}</pre>
  {/if}
  {#if timeTravelEnabled && (showLimited || !isLimited)}
    <div class={timeTravelPanelClassName}>
      <button
        class={timeTravelPanelButtonClassName}
        onclick={() => {
          if (playingIndexRef === totalEditorStates - 1) {
            playingIndexRef = 1;
          }
          isPlaying = !isPlaying;
        }}
        type="button">
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        class={timeTravelPanelSliderClassName}
        bind:this={inputRef}
        onchange={(event) => {
          // @ts-ignore TS not supported in Svelte Html - https://github.com/sveltejs/svelte/issues/4701
          const editorStateIndex = Number(event.target.value);
          const timeStampedEditorState =
            timeStampedEditorStates[editorStateIndex];

          if (timeStampedEditorState) {
            playingIndexRef = editorStateIndex;
            editor.setEditorState(timeStampedEditorState[1]);
          }
        }}
        type="range"
        min="1"
        max={totalEditorStates - 1} />
      <button
        class={timeTravelPanelButtonClassName}
        onclick={() => {
          const rootElement = editor.getRootElement();

          if (rootElement !== null) {
            rootElement.contentEditable = 'true';
            const index = timeStampedEditorStates.length - 1;
            const timeStampedEditorState = timeStampedEditorStates[index];
            editor.setEditorState(timeStampedEditorState[1]);
            const input = inputRef;

            if (input !== null) {
              input.value = String(index);
            }

            timeTravelEnabled = false;
            isPlaying = false;
          }
        }}
        type="button">
        Exit
      </button>
    </div>
  {/if}
</div>

<style>
  pre {
    line-height: 1.1;
    background: #222;
    color: #fff;
    margin: 0;
    padding: 10px;
    font-size: 12px;
    overflow: auto;
    max-height: 400px;
  }

  pre::-webkit-scrollbar {
    background: transparent;
    width: 10px;
  }

  pre::-webkit-scrollbar-thumb {
    background: #999;
  }
</style>
