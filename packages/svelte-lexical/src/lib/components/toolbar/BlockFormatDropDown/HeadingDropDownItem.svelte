<script lang="ts">
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import {$getSelection as getSelection} from 'lexical';
  import {
    $createHeadingNode as createHeadingNode,
    type HeadingTagType,
  } from '@lexical/rich-text';
  import {$setBlocksType as setBlocksType} from '@lexical/selection';
  import type {Writable} from 'svelte/store';
  import type {blockTypeToBlockName} from './blockTypeToBlockName.js';
  import {getContext} from 'svelte';
  import {getEditor} from '$lib/core/composerContext.js';

  interface Props {
    headingSize: HeadingTagType;
  }

  let {headingSize}: Props = $props();

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatHeading = (headingSize: HeadingTagType) => {
    if ($blockType !== headingSize) {
      editor.update(() => {
        const selection = getSelection();
        setBlocksType(selection, () => createHeadingNode(headingSize));
      });
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === headingSize ? 'active dropdown-item-active' : '')}
  onclick={() => formatHeading(headingSize)}>
  <i class="icon {headingSize}"></i>
  <span class="text">Heading {headingSize.charAt(1)}</span>
</DropDownItem>
