<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName.js';
  import {
    $getSelection as getSelection,
    $createParagraphNode as createParagraphNode,
  } from 'lexical';
  import {$setBlocksType as setBlocksType} from '@lexical/selection';
  import {getEditor} from '$lib/core/composerContext.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatParagraph = () => {
    if ($blockType !== 'paragraph') {
      editor.update(() => {
        const selection = getSelection();
        setBlocksType(selection, () => createParagraphNode());
      });
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'paragraph' ? 'active dropdown-item-active' : '')}
  onclick={formatParagraph}>
  <i class="icon paragraph"></i>
  <span class="text">Normal</span>
</DropDownItem>
