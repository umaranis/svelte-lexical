<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../../core/composerContext';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';
  import pkgSelection from '@lexical/selection';
  const {$setBlocksType: setBlocksType} = pkgSelection;
  import pkgLx from 'lexical';
  const {
    $getSelection: getSelection,
    $isRangeSelection: isRangeSelection,
    DEPRECATED_$isGridSelection,
  } = pkgLx;
  import pkgrich from '@lexical/rich-text';
  const {$createQuoteNode: createQuoteNode} = pkgrich;

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatQuote = () => {
    if ($blockType !== 'quote') {
      editor.update(() => {
        const selection = getSelection();
        if (
          isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
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
