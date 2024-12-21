<script lang="ts">
  import {getEditor} from '../../../../composerContext.js';

  import {CodeNode, $isCodeNode as isCodeNode} from '@lexical/code';
  import {$getNearestNodeFromDOMNode as getNearestNodeFromDOMNode} from 'lexical';
  import type {Options} from 'prettier';
  import {
    loadPrettierFormat,
    loadPrettierParserByLang,
    PRETTIER_OPTIONS_BY_LANG,
  } from './PrettierLangOptions.js';

  const editor = getEditor();
  interface Props {
    lang: string;
    getCodeDOMNode: () => HTMLElement | null;
  }

  let {lang, getCodeDOMNode}: Props = $props();

  function getPrettierOptions(lang: string): Options {
    const options = PRETTIER_OPTIONS_BY_LANG[lang];
    if (!options) {
      throw new Error(
        `CodeActionMenuPlugin: Prettier does not support this language: ${lang}`,
      );
    }

    return options;
  }

  let syntaxError = $state('');
  let tipsVisible = $state(false);

  async function handleClick(): Promise<void> {
    const codeDOMNode = getCodeDOMNode();
    if (!codeDOMNode) {
      return;
    }

    try {
      const format = await loadPrettierFormat();
      const options = getPrettierOptions(lang);
      options.plugins = await loadPrettierParserByLang(lang);

      let codeNode: CodeNode;
      let content = '';
      editor.update(() => {
        codeNode = getNearestNodeFromDOMNode(codeDOMNode) as CodeNode;
        if (isCodeNode(codeNode)) {
          content = codeNode.getTextContent();
        }
      });

      if (content) {
        let parsed = '';
        parsed = await format(content, options);

        editor.update(() => {
          if (parsed !== '') {
            const selection = codeNode.select(0);
            selection.insertText(parsed);
            syntaxError = '';
            tipsVisible = false;
          }
        });
      }
    } catch (error: unknown) {
      setError(error);
    }
  }

  function setError(error: unknown) {
    if (error instanceof Error) {
      syntaxError = error.message;
      tipsVisible = true;
    } else {
      // eslint-disable-next-line no-console
      console.error('Unexpected error: ', error);
    }
  }

  function handleMouseEnter() {
    if (syntaxError !== '') {
      tipsVisible = true;
    }
  }

  function handleMouseLeave() {
    if (syntaxError !== '') {
      tipsVisible = false;
    }
  }
</script>

<div class="prettier-wrapper">
  <button
    class="menu-item"
    onclick={handleClick}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    aria-label="prettier">
    {#if syntaxError}
      <i class="format prettier-error"></i>
    {:else}
      <i class="format prettier"></i>
    {/if}
  </button>
  {#if tipsVisible}
    <pre class="code-error-tips">{syntaxError}</pre>
  {/if}
</div>

<style>
  :global(.code-action-menu-container .prettier-wrapper) {
    position: relative;
  }

  :global(.code-action-menu-container .prettier-wrapper .code-error-tips) {
    padding: 5px;
    border-radius: 4px;
    color: #fff;
    background: #222;
    margin-top: 4px;
    position: absolute;
    top: 26px;
    right: 0;
  }
</style>
