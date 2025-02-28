<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from '../ToolbarData.js';
  import {formatQuote} from '$lib/core/commands.js';
  import {SHORTCUTS} from '../shortcuts.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();
</script>

<DropDownItem
  class={'item wide ' +
    ($blockType === 'quote' ? 'active dropdown-item-active' : '')}
  onclick={() => formatQuote(editor, $blockType)}>
  <div class="icon-text-container">
    <i class="icon quote"></i>
    <span class="text">Quote</span>
  </div>
  <span class="shortcut">{SHORTCUTS.QUOTE}</span>
</DropDownItem>
