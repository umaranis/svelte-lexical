<script lang="ts">
  import {getEditor} from '$lib/core/composerContext.js';
  import {ALL_TRANSFORMERS} from '$lib/core/plugins/MarkdownShortcut/transformers.js';
  import {
    $createCodeNode as createCodeNode,
    $isCodeNode as isCodeNode,
  } from '@lexical/code';
  import {
    $convertFromMarkdownString as convertFromMarkdownString,
    $convertToMarkdownString as convertToMarkdownString,
  } from '@lexical/markdown';
  import {
    $createTextNode as createTextNode,
    $getRoot as getRoot,
    type LexicalEditor,
  } from 'lexical';

  const editor: LexicalEditor = getEditor();

  function handleMarkdownToggle() {
    editor.update(() => {
      const root = getRoot();
      const firstChild = root.getFirstChild();
      if (isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        convertFromMarkdownString(
          firstChild.getTextContent(),
          ALL_TRANSFORMERS,
          undefined, // node
          true,
        );
      } else {
        const markdown = convertToMarkdownString(
          ALL_TRANSFORMERS,
          undefined, //node
          true,
        );
        const codeNode = createCodeNode('markdown');
        codeNode.append(createTextNode(markdown));
        root.clear().append(codeNode);
        if (markdown.length === 0) {
          codeNode.select();
        }
      }
    });
  }
</script>

<button
  type="button"
  class="action-button"
  onclick={handleMarkdownToggle}
  title="Convert From Markdown"
  aria-label="Convert from markdown">
  <i class="markdown"></i>
</button>
