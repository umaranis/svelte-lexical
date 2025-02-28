<script lang="ts">
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import {type HeadingTagType} from '@lexical/rich-text';
  import type {Writable} from 'svelte/store';
  import type {blockTypeToBlockName} from '../ToolbarData.js';
  import {getContext} from 'svelte';
  import {getEditor} from '$lib/core/composerContext.js';
  import {formatHeading} from '$lib/core/commands.js';
  import {SHORTCUTS} from '../shortcuts.js';

  interface Props {
    headingSize: HeadingTagType;
  }

  let {headingSize}: Props = $props();

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();
</script>

<DropDownItem
  class={'item wide ' +
    ($blockType === headingSize ? 'active dropdown-item-active' : '')}
  onclick={() => formatHeading(editor, $blockType, headingSize)}>
  <div class="icon-text-container">
    <i class="icon {headingSize}"></i>
    <span class="text">Heading {headingSize.charAt(1)}</span>
  </div>
  <span class="shortcut">
    {SHORTCUTS[`HEADING${headingSize.charAt(1)}` as keyof typeof SHORTCUTS]}
  </span>
</DropDownItem>
