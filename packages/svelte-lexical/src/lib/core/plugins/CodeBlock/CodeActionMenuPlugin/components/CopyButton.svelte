<script lang="ts">
  import {$isCodeNode as isCodeNode} from '@lexical/code';
  import {
    $getNearestNodeFromDOMNode as getNearestNodeFromDOMNode,
    $getSelection as getSelection,
    $setSelection as setSelection,
  } from 'lexical';
  import {getEditor} from '../../../../composerContext.js';

  import {useDebounce} from '../utils.js';

  const editor = getEditor();
  interface Props {
    getCodeDOMNode: () => HTMLElement | null;
  }

  let {getCodeDOMNode}: Props = $props();

  let isCopyCompleted = $state(false);

  const removeSuccessIcon = useDebounce(() => {
    isCopyCompleted = false;
  }, 1000);

  async function handleClick(): Promise<void> {
    const codeDOMNode = getCodeDOMNode();

    if (!codeDOMNode) {
      return;
    }

    let content = '';

    editor.update(() => {
      const codeNode = getNearestNodeFromDOMNode(codeDOMNode);

      if (isCodeNode(codeNode)) {
        content = codeNode.getTextContent();
      }

      const selection = getSelection();
      setSelection(selection);
    });

    try {
      await navigator.clipboard.writeText(content);
      isCopyCompleted = true;
      removeSuccessIcon();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy: ', err);
    }
  }
</script>

<button class="menu-item" onclick={handleClick} aria-label="copy">
  {#if isCopyCompleted}
    <i class="format success"></i>
  {:else}
    <i class="format copy"></i>
  {/if}
</button>
