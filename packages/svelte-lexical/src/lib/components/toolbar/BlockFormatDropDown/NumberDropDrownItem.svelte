<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from '../ToolbarData.js';
  import {formatNumberedList} from '$lib/core/commands.js';
  import {SHORTCUTS} from '../shortcuts.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();
</script>

<DropDownItem
  class={'item wide ' +
    ($blockType === 'number' ? 'active dropdown-item-active' : '')}
  onclick={() => formatNumberedList(editor, $blockType)}>
  <div class="icon-text-container">
    <i class="icon numbered-list"></i>
    <span class="text">Numbered List</span>
  </div>
  <span class="shortcut">{SHORTCUTS.NUMBERED_LIST}</span>
</DropDownItem>
