<script lang="ts">
  import {
    Composer,
    ContentEditable,
    RichTextPlugin,
    ListPlugin,
    CheckListPlugin,
    LinkPlugin,
    OnChangePlugin,
    PlaceHolder,
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    AutoLinkNode,
    LinkNode,
    CodeNode,
    CodeHighlightNode,
    HorizontalRuleNode,
    ImageNode,
    LayoutContainerNode,
    LayoutItemNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    YouTubeNode,
    TweetNode,
    BlueskyNode,
    AutoLinkPlugin,
    ColumnLayoutPlugin,
    SharedHistoryPlugin,
    ImagePlugin,
    CaptionEditorHistoryPlugin,
    HorizontalRulePlugin,
    MarkdownShortcutPlugin,
    ALL_TRANSFORMERS,
    TablePlugin,
    TableHoverActionPlugin,
    TableCellResizerPlugin,
    TableActionMenuPlugin,
    YoutubePlugin,
    TwitterPlugin,
    BlueskyPlugin,
    TabIndentationPlugin,
    CodeActionMenuPlugin,
    FloatingLinkEditorPlugin,
    ComponentPickerMenuPlugin,
    FocusEditor,
    CAN_UNDO_COMMAND,
    CAN_REDO_COMMAND,
    HISTORY_MERGE_TAG,
    $getRoot as getRoot,
    $createParagraphNode as createParagraphNode,
  } from 'svelte-lexical';
  import {CodeHighlightShikiPlugin} from 'svelte-lexical/shiki';
  import {theme as editorTheme} from 'svelte-lexical/dist/themes/default';
  import type {EditorState, HistoryState} from 'svelte-lexical';
  import {notesStore} from './notesStore.svelte';
  import Toolbar from './Toolbar.svelte';
  import {tick} from 'svelte';

  // Keyed by note id, holds each note's undo/redo stacks so switching notes
  // doesn't lose history. Lives at module scope (not component state) so it
  // survives even if the Editor component itself remounts (e.g. closing the
  // last note and opening a new one).
  const historyCache = new Map<
    string,
    Pick<HistoryState, 'undoStack' | 'redoStack'>
  >();

  interface Props {
    noteId: string;
    initialContent: string | null;
    title: string;
  }

  let {noteId, initialContent, title}: Props = $props();

  let editorDiv: HTMLDivElement | undefined = $state();
  let titleInputEl: HTMLInputElement | undefined = $state();
  let composerRef: Composer | undefined = $state();
  // svelte-ignore state_referenced_locally
  let editableTitle = $state(title);
  let isBlankNote = $derived(
    (title.trim() === '' || title === 'Untitled') && !initialContent,
  );
  let saveTimer: ReturnType<typeof setTimeout> | null = null;
  // svelte-ignore state_referenced_locally
  let previousNoteId = noteId;

  $effect(() => {
    editableTitle = title;
  });


  // The editor instance is shared across notes (App.svelte no longer
  // destroys/remounts Editor on note switch), so switching notes means
  // swapping the visible content and the active undo/redo stacks in place,
  // rather than relying on a fresh editor+history per note.
  $effect(() => {
    const newNoteId = noteId;
    const newContent = initialContent;
    if (newNoteId === previousNoteId) return;
    const oldNoteId = previousNoteId;
    previousNoteId = newNoteId;
    switchNote(oldNoteId, newNoteId, newContent);
  });

  function switchNote(
    oldNoteId: string,
    newNoteId: string,
    newContent: string | null,
  ) {
    const editor = composerRef?.getEditor();
    const historyState = composerRef?.getHistoryState();
    if (!editor || !historyState) return;

    // Flush any pending debounced save for the note we're leaving, and clear
    // the timer so it can't later fire and clobber the next note's save.
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
      notesStore.saveNoteContent(
        oldNoteId,
        JSON.stringify(editor.getEditorState().toJSON()),
      );
    }

    historyCache.set(oldNoteId, {
      undoStack: historyState.undoStack,
      redoStack: historyState.redoStack,
    });
    const cached = historyCache.get(newNoteId);
    historyState.undoStack = cached ? cached.undoStack : [];
    historyState.redoStack = cached ? cached.redoStack : [];
    editor.dispatchCommand(CAN_UNDO_COMMAND, historyState.undoStack.length > 0);
    editor.dispatchCommand(CAN_REDO_COMMAND, historyState.redoStack.length > 0);

    if (newContent) {
      editor.setEditorState(editor.parseEditorState(newContent), {
        tag: HISTORY_MERGE_TAG,
      });
    } else {
      editor.update(
        () => {
          const root = getRoot();
          root.clear();
          root.append(createParagraphNode());
        },
        {tag: HISTORY_MERGE_TAG},
      );
    }
  }

  // svelte-ignore state_referenced_locally
  const initialConfig = {
    namespace: 'QalamEditor',
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      HorizontalRuleNode,
      ImageNode,
      AutoLinkNode,
      LinkNode,
      CodeNode,
      CodeHighlightNode,
      LayoutContainerNode,
      LayoutItemNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      YouTubeNode,
      TweetNode,
      BlueskyNode,
    ],
    // eslint-disable-next-line no-console
    onError: (error: Error) => console.error(error),
    theme: editorTheme,
    editorState: initialContent || undefined,
  };

  function handleChange(editorState: EditorState) {
    // Capture noteId now: this editor instance is shared across notes, so a
    // timer scheduled for note A must not save into whatever note is active
    // by the time it fires (e.g. if the user switches notes within 800ms).
    const targetNoteId = noteId;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      saveTimer = null;
      await notesStore.saveNoteContent(
        targetNoteId,
        JSON.stringify(editorState.toJSON()),
      );
    }, 800);
  }

  async function handleTitleBlur() {
    const trimmed = editableTitle.trim() || 'Untitled';
    editableTitle = trimmed;
    if (trimmed !== title) {
      await notesStore.renameNote(noteId, trimmed);
    }
  }

  function handleTitleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
      FocusEditor(composerRef.getEditor());
    }
  }
</script>

<div class="editor-wrapper">
  <div class="title-bar">
    <input
      class="note-title-input"
      bind:this={titleInputEl}
      bind:value={editableTitle}
      onblur={handleTitleBlur}
      onkeydown={handleTitleKeydown}
      placeholder="Untitled"
      spellcheck="false" />
    {#if notesStore.isSaving}
      <span class="save-indicator">Saving…</span>
    {/if}
  </div>

  <Composer {initialConfig} bind:this={composerRef}>
    <div class="editor-shell svelte-lexical">
      <Toolbar />
      <div class="editor-scroller">
        <div class="editor" bind:this={editorDiv}>
          <RichTextPlugin />
          <ContentEditable />
          <PlaceHolder>Start writing…</PlaceHolder>
          <SharedHistoryPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <FloatingLinkEditorPlugin anchorElem={editorDiv} />
          <HorizontalRulePlugin />
          <ColumnLayoutPlugin />
          <CodeHighlightShikiPlugin />
          <CodeActionMenuPlugin anchorElem={editorDiv} />
          <ImagePlugin>
            <CaptionEditorHistoryPlugin />
          </ImagePlugin>
          <MarkdownShortcutPlugin transformers={ALL_TRANSFORMERS} />
          <TablePlugin hasHorizontalScroll={true} />
          <TableHoverActionPlugin anchorElem={editorDiv} />
          <TableCellResizerPlugin />
          <TableActionMenuPlugin anchorElem={editorDiv} cellMerge={true} />
          <YoutubePlugin />
          <TwitterPlugin />
          <BlueskyPlugin />
          <TabIndentationPlugin />
          <ComponentPickerMenuPlugin />
          <OnChangePlugin
            onChange={handleChange}
            ignoreSelectionChange={true}
            ignoreHistoryMergeTagChange={true} />
        </div>
      </div>
    </div>
  </Composer>
</div>

<style>
  .editor-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    overflow: hidden;
  }

  .title-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px 8px;
    border-bottom: 1px solid #e8e8e8;
    flex-shrink: 0;
  }

  .note-title-input {
    flex: 1;
    font-size: 22px;
    font-weight: 700;
    color: #1a1a2e;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    font-family: inherit;
  }

  .note-title-input::placeholder {
    color: #bbb;
  }

  .save-indicator {
    font-size: 12px;
    color: #aaa;
    flex-shrink: 0;
  }

  .editor-scroller {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 24px 24px;
  }

  .editor-wrapper :global(.editor-shell) {
    margin: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .editor-wrapper :global(.toolbar) {
    scrollbar-width: none;
  }

  .editor-wrapper :global(.toolbar)::-webkit-scrollbar {
    display: none;
  }

  .editor {
    position: relative;
    min-height: 100%;
  }

  .editor :global(.editor-input) {
    min-height: 400px;
    outline: none;
    font-size: 15px;
    line-height: 1.7;
    color: #2d2d2d;
    caret-color: #6c63ff;
  }

  /* required to avoid transparent link editor */
  .svelte-lexical :global(.link-editor) {
    will-change: auto;
  }
</style>
