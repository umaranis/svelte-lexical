<script lang="ts">
  import type {TextNode} from 'lexical';

  import {
    $createKeywordNode as createKeywordNode,
    KeywordNode,
  } from './KeywordNode.js';
  import {getEditor} from '../composerContext.js';
  import {mergeRegister} from '@lexical/utils';
  import {registerLexicalTextEntity} from '@lexical/text';
  import {onMount} from 'svelte';

  interface Props {
    keywordsRegex: RegExp;
  }

  let {keywordsRegex}: Props = $props();

  const editor = getEditor();

  if (!editor.hasNodes([KeywordNode])) {
    throw new Error('KeywordsPlugin: KeywordNode not registered on editor');
  }

  onMount(() => {
    return mergeRegister(
      ...registerLexicalTextEntity<KeywordNode>(
        editor,
        getKeywordMatch,
        KeywordNode,
        createKeywordNodeFromTextNode,
      ),
    );
  });

  function createKeywordNodeFromTextNode(textNode: TextNode): KeywordNode {
    return createKeywordNode(textNode.getTextContent());
  }

  function getKeywordMatch(text: string) {
    const matchArr = keywordsRegex.exec(text);

    if (matchArr === null) {
      return null;
    }

    const hashtagLength = matchArr[2].length;
    const startOffset = matchArr.index + matchArr[1].length;
    const endOffset = startOffset + hashtagLength;
    return {
      end: endOffset,
      start: startOffset,
    };
  }
</script>
