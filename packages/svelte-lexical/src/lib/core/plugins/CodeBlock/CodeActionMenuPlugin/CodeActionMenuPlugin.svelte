<script lang="ts">
  import {run} from 'svelte/legacy';

  import {
    $isCodeNode as isCodeNode,
    CodeNode,
    getLanguageFriendlyName,
    normalizeCodeLang,
  } from '@lexical/code';
  import {$getNearestNodeFromDOMNode as getNearestNodeFromDOMNode} from 'lexical';
  import {onMount} from 'svelte';
  import {getEditor} from '../../../composerContext.js';
  import CopyButton from './components/CopyButton.svelte';

  import PrettierButton from './components/PrettierButton.svelte';
  import {canBePrettier} from './components/PrettierLangOptions.js';
  import {useDebounce} from './utils.js';

  const CODE_PADDING = 8;

  interface Position {
    top: string;
    right: string;
  }

  interface Props {
    // this component is supposed to be appended to `anchorElem` as per lexical but positioning works without it
    anchorElem?: HTMLElement;
  }

  let {anchorElem = document.body}: Props = $props();

  const editor = getEditor();

  let lang = $state('');
  let isShown = $state(false);
  $inspect(isShown);
  let shouldListenMouseMove = $state(false);
  let position: Position = $state({
    right: '0',
    top: '0',
  });
  const codeSetRef: Set<string> = new Set();
  let codeDOMNodeRef: HTMLElement | null = null;

  function getCodeDOMNode(): HTMLElement | null {
    return codeDOMNodeRef;
  }

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const {codeDOMNode, isOutside} = getMouseInfo(event);
      if (isOutside) {
        isShown = false;
        return;
      }

      if (!codeDOMNode) {
        return;
      }

      codeDOMNodeRef = codeDOMNode;

      let codeNode: CodeNode | null = null;
      let _lang = '';

      editor.update(() => {
        const maybeCodeNode = getNearestNodeFromDOMNode(codeDOMNode);

        if (isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode;
          _lang = codeNode.getLanguage() || '';
        }
      });

      if (codeNode) {
        const {y: editorElemY, right: editorElemRight} =
          anchorElem.getBoundingClientRect();
        const {y, right} = codeDOMNode.getBoundingClientRect();
        lang = _lang;
        isShown = true;
        position = {
          right: `${editorElemRight - right + CODE_PADDING}px`,
          top: `${y - editorElemY}px`,
        };
      }
    },
    50,
    1000,
  );

  onMount(() => {
    return editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            switch (type) {
              case 'created':
                codeSetRef.add(key);
                break;

              case 'destroyed':
                codeSetRef.delete(key);
                break;

              default:
                break;
            }
          }
        });
        shouldListenMouseMove = codeSetRef.size > 0;
      },
      {skipInitialization: false},
    );
  });

  run(() => {
    if (shouldListenMouseMove) {
      document.addEventListener('mousemove', debouncedOnMouseMove);
    } else {
      isShown = false;
      debouncedOnMouseMove.cancel();
      document.removeEventListener('mousemove', debouncedOnMouseMove);
    }
  });

  let normalizedLang = $derived(normalizeCodeLang(lang));
  let codeFriendlyName = $derived(getLanguageFriendlyName(lang));

  function getMouseInfo(event: MouseEvent): {
    codeDOMNode: HTMLElement | null;
    isOutside: boolean;
  } {
    const target = event.target;

    if (target && target instanceof HTMLElement) {
      const codeDOMNode = target.closest<HTMLElement>('code');
      const isOutside = !(
        codeDOMNode ||
        target.closest<HTMLElement>('div.code-action-menu-container')
      );

      return {codeDOMNode, isOutside};
    } else {
      return {codeDOMNode: null, isOutside: true};
    }
  }
</script>

{#if isShown}
  <div
    class="code-action-menu-container"
    style="right:{position.right};top:{position.top};">
    <div class="code-highlight-language">{codeFriendlyName}</div>
    <CopyButton {getCodeDOMNode} />
    {#if canBePrettier(normalizedLang)}
      <PrettierButton {getCodeDOMNode} lang={normalizedLang} />
    {/if}
  </div>
{/if}

<style>
  :global(.code-action-menu-container) {
    height: 35.8px;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.5);
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: row;
    user-select: none;
  }

  :global(.code-action-menu-container .code-highlight-language) {
    margin-right: 4px;
  }

  :global(.code-action-menu-container button.menu-item) {
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 4px;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
  }

  :global(.code-action-menu-container button.menu-item i.format) {
    height: 16px;
    width: 16px;
    opacity: 0.6;
    display: flex;
    color: rgba(0, 0, 0, 0.5);
    background-size: contain;
  }

  :global(.code-action-menu-container button.menu-item:hover) {
    border: 1px solid rgba(0, 0, 0, 0.3);
    opacity: 0.9;
  }

  :global(.code-action-menu-container button.menu-item:active) {
    background-color: rgba(223, 232, 250);
    border: 1px solid rgba(0, 0, 0, 0.45);
  }
</style>
