<script lang="ts">
  import {
    Composer,
    ContentEditable,
    RichTextPlugin,
    HistoryPlugin,
    ListPlugin,
    CheckListPlugin,
    LinkPlugin,
    AutoFocusPlugin,
    OnChangePlugin,
    ToolbarRichText,
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
    HorizontalRulePlugin,
    CodeHighlightPrismPlugin,
  } from 'svelte-lexical';
  import {theme as editorTheme} from 'svelte-lexical/dist/themes/default';
  import type {EditorState} from 'lexical';
  import {notesStore} from './notesStore.svelte';

  interface Props {
    noteId: string;
    initialContent: string | null;
    title: string;
  }

  let {noteId, initialContent, title}: Props = $props();

  let editableTitle = $state(title);
  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    editableTitle = title;
  });

  const initialConfig = {
    namespace: 'QalamEditor',
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      AutoLinkNode,
      LinkNode,
      CodeNode,
      CodeHighlightNode,
      HorizontalRuleNode,
    ],
    onError: (error: Error) => console.error(error),
    theme: editorTheme,
    editorState: initialContent || null,
  };

  function handleChange(editorState: EditorState) {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      await notesStore.saveNoteContent(
        noteId,
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
    }
  }
</script>

<div class="editor-wrapper">
  <div class="title-bar">
    <input
      class="note-title-input"
      bind:value={editableTitle}
      onblur={handleTitleBlur}
      onkeydown={handleTitleKeydown}
      placeholder="Untitled"
      spellcheck="false" />
    {#if notesStore.isSaving}
      <span class="save-indicator">Saving…</span>
    {/if}
  </div>

  <Composer {initialConfig}>
    <div class="editor-shell svelte-lexical">
      <ToolbarRichText />
      <div class="editor-scroller">
        <div class="editor-inner">
          <RichTextPlugin />
          <ContentEditable />
          <PlaceHolder>Start writing…</PlaceHolder>
          <HistoryPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <AutoFocusPlugin />
          <HorizontalRulePlugin />
          <CodeHighlightPrismPlugin />
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
    overflow-y: auto;
    padding: 0 24px 24px;
  }

  .editor-wrapper :global(.editor-shell) {
    margin: 0;
  }

  .editor-inner {
    position: relative;
    min-height: 100%;
  }

  .editor-inner :global(.editor-input) {
    min-height: 400px;
    outline: none;
    font-size: 15px;
    line-height: 1.7;
    color: #2d2d2d;
    caret-color: #6c63ff;
  }
</style>
