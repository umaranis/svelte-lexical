<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';
  import pkgLx from 'lexical';
  const {
    $getSelection: getSelection,
    $isRangeSelection: isRangeSelection,
    $createParagraphNode: createParagraphNode,
    DEPRECATED_$isGridSelection,
  } = pkgLx;
  import pkgSelection from '@lexical/selection';
  const {$setBlocksType: setBlocksType} = pkgSelection;
  import {getEditor} from '../../../core/composerContext';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatParagraph = () => {
    if ($blockType !== 'paragraph') {
      editor.update(() => {
        const selection = getSelection();
        if (
          isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        )
          setBlocksType(selection, () => createParagraphNode());
      });
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'paragraph' ? 'active dropdown-item-active' : '')}
  on:click={formatParagraph}>
  <i class="icon paragraph" />
  <span class="text">Normal</span>
</DropDownItem>
