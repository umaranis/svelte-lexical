<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName.js';
  import {$setBlocksType as setBlocksType} from '@lexical/selection';
  import {$getSelection as getSelection} from 'lexical';
  import {$createQuoteNode as createQuoteNode} from '@lexical/rich-text';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatQuote = () => {
    if ($blockType !== 'quote') {
      editor.update(() => {
        const selection = getSelection();
        setBlocksType(selection, () => createQuoteNode());
      });
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'quote' ? 'active dropdown-item-active' : '')}
  onclick={formatQuote}>
  <i class="icon quote"></i>
  <span class="text">Quote</span>
</DropDownItem>
