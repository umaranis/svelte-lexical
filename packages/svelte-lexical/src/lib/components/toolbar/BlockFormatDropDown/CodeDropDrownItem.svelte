<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from '../ToolbarData.js';
  import {formatCode} from '$lib/core/commands.js';
  import {SHORTCUTS} from '../shortcuts.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();
</script>

<DropDownItem
  class={'item wide ' +
    ($blockType === 'code' ? 'active dropdown-item-active' : '')}
  onclick={() => formatCode(editor, $blockType)}>
  <div class="icon-text-container">
    <i class="icon code"></i>
    <span class="text">Code block</span>
  </div>
  <span class="shortcut">{SHORTCUTS.CODE_BLOCK}</span>
</DropDownItem>
