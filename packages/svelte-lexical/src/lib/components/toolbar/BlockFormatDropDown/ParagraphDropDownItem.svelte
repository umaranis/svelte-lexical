<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from '../ToolbarData.js';
  import {getEditor} from '$lib/core/composerContext.js';
  import {formatParagraph} from '$lib/core/commands.js';
  import {SHORTCUTS} from '../shortcuts.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();
</script>

<DropDownItem
  class={'item wide ' +
    ($blockType === 'paragraph' ? 'active dropdown-item-active' : '')}
  onclick={() => formatParagraph(editor)}>
  <div class="icon-text-container">
    <i class="icon paragraph"></i>
    <span class="text">Normal</span>
  </div>
  <span class="shortcut">{SHORTCUTS.NORMAL}</span>
</DropDownItem>
