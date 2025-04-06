<script lang="ts">
  import {
    Composer,
    ContentEditable,
    ActionBar,
    RichTextPlugin,
    HistoryPlugin,
    ListPlugin,
    CheckListPlugin,
    HorizontalRulePlugin,
    ImagePlugin,
    MarkdownShortcutPlugin,
    TEXT_FORMAT_TRANSFORMERS,
    ELEMENT_TRANSFORMERS,
    HR,
    IMAGE,
    CHECK_LIST,
    LinkNode,
    LinkPlugin,
    validateUrl,
    CAN_USE_DOM,
    FloatingLinkEditorPlugin,
    LINK,
    AutoLinkNode,
    AutoLinkPlugin,
    CodeNode,
    CodeHighlightNode,
    CodeHighlightPlugin,
    CodeActionMenuPlugin,
  } from '$lib/index.js';
  import {
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    HorizontalRuleNode,
    ImageNode,
  } from '$lib/index.js';
  import {theme as editorTheme} from '$lib/themes/light-dark/editor/LightDarkEditorTheme.js';
  import {
    $getRoot as getRoot,
    $createTextNode as createTextNode,
    $createParagraphNode as createParagraphNode,
  } from '$lib/index.js';
  import {onMount} from 'svelte';
  import Composer5Toolbar from './Composer5Toolbar.svelte';

  let isSmallWidthViewport = $state(true);
  let editorDiv: HTMLDivElement | undefined = $state();

  const initialConfig = {
    theme: editorTheme,
    namespace: 'pg_sveltekit',
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      HorizontalRuleNode,
      ImageNode,
      LinkNode,
      AutoLinkNode,
      CodeNode,
      CodeHighlightNode,
    ],
    onError: (error: Error) => {
      throw error;
    },
    editorState: () => {
      const root = getRoot();
      if (root.getFirstChild() === null) {
        const paragraph = createParagraphNode();
        paragraph.append(
          createTextNode('This demo environment is built with '),
          createTextNode('svelte-lexical').toggleFormat('code'),
          createTextNode('.'),
          createTextNode(' Try typing in '),
          createTextNode('some text').toggleFormat('bold'),
          createTextNode(' with '),
          createTextNode('different').toggleFormat('italic'),
          createTextNode(' formats.'),
        );
        root.append(paragraph);
      }
    },
  };

  onMount(() => {
    function updateViewPortWidth() {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        isSmallWidthViewport = isNextSmallWidthViewport;
      }
    }
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  });
</script>

<Composer {initialConfig}>
  <div class="editor-shell svelte-lexical">
    <Composer5Toolbar />
    <div class="editor-container">
      <div class="editor-scroller">
        <div class="editor" bind:this={editorDiv}>
          <ContentEditable />
        </div>
      </div>
      <RichTextPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <HorizontalRulePlugin />
      <ImagePlugin captionsEnabled={false} />
      <AutoLinkPlugin />
      <LinkPlugin {validateUrl} />
      <CodeHighlightPlugin />
      {#if !isSmallWidthViewport}
        <FloatingLinkEditorPlugin anchorElem={editorDiv} />
        <CodeActionMenuPlugin anchorElem={editorDiv} />
      {/if}
      <MarkdownShortcutPlugin
        transformers={[
          ...TEXT_FORMAT_TRANSFORMERS,
          ...ELEMENT_TRANSFORMERS,
          HR,
          IMAGE,
          CHECK_LIST,
          LINK,
        ]} />

      <ActionBar />
    </div>
  </div>
</Composer>
