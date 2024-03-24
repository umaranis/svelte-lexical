<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../../core/composerContext';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';
  import {$setBlocksType as setBlocksType} from '@lexical/selection';
  import {
    $getSelection as getSelection,
    $INTERNAL_isPointSelection as INTERNAL_PointSelection,
  } from 'lexical';
  import {$createQuoteNode as createQuoteNode} from '@lexical/rich-text';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatQuote = () => {
    if ($blockType !== 'quote') {
      editor.update(() => {
        const selection = getSelection();
        if (INTERNAL_PointSelection(selection)) {
          setBlocksType(selection, () => createQuoteNode());
        }
      });
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'quote' ? 'active dropdown-item-active' : '')}
  on:click={formatQuote}>
  <i class="icon quote" />
  <span class="text">Quote</span>
</DropDownItem>
