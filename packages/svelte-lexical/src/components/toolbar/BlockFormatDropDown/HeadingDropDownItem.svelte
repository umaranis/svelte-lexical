<script lang="ts">
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import pkgLx from 'lexical';
  const {
    $getSelection: getSelection,
    $isRangeSelection: isRangeSelection,
    DEPRECATED_$isGridSelection,
  } = pkgLx;
  import {type HeadingTagType} from '@lexical/rich-text';
  import pkgrich from '@lexical/rich-text';
  const {$createHeadingNode: createHeadingNode} = pkgrich;
  import pkgSelection from '@lexical/selection';
  const {$setBlocksType: setBlocksType} = pkgSelection;
  import type {Writable} from 'svelte/store';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';
  import {getContext} from 'svelte';
  import {getEditor} from '../../../core/composerContext';

  export let headingSize: HeadingTagType;

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatHeading = (headingSize: HeadingTagType) => {
    if ($blockType !== headingSize) {
      editor.update(() => {
        const selection = getSelection();
        if (
          isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          setBlocksType(selection, () => createHeadingNode(headingSize));
        }
      });
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === headingSize ? 'active dropdown-item-active' : '')}
  on:click={() => formatHeading(headingSize)}>
  <i class="icon {headingSize}" />
  <span class="text">Heading {headingSize.charAt(1)}</span>
</DropDownItem>
