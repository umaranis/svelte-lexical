<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';
  import {
    $getSelection as getSelection,
    $createParagraphNode as createParagraphNode,
    $INTERNAL_isPointSelection as INTERNAL_PointSelection,
  } from 'lexical';
  import {$setBlocksType as setBlocksType} from '@lexical/selection';
  import {getEditor} from '../../../core/composerContext';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatParagraph = () => {
    if ($blockType !== 'paragraph') {
      editor.update(() => {
        const selection = getSelection();
        if (INTERNAL_PointSelection(selection))
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
