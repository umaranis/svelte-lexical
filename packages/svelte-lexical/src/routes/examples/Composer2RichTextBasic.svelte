<script lang="ts">
  import {
    Composer,
    ContentEditable,
    ActionBar,
    RichTextPlugin,
  } from '$lib/index.js';
  import {theme as editorTheme} from '$lib/themes/system-light-dark/index.js';
  import {
    $getRoot as getRoot,
    $createTextNode as createTextNode,
    $createParagraphNode as createParagraphNode,
  } from '$lib/index.js';
  import Composer2Toolbar from './Composer2Toolbar.svelte';

  const initialConfig = {
    theme: editorTheme,
    namespace: 'pg_sveltekit',
    nodes: [],
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
</script>

<Composer {initialConfig}>
  <div class="editor-shell svelte-lexical">
    <Composer2Toolbar />
    <div class="editor-container">
      <div class="editor-scroller">
        <div class="editor">
          <ContentEditable />
        </div>
      </div>
      <RichTextPlugin />
      <ActionBar />
    </div>
  </div>
</Composer>
