<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from '../ToolbarData.js';
  import {formatBulletList} from '$lib/core/commands.js';
  import {SHORTCUTS} from '../shortcuts.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();
</script>

<DropDownItem
  class={'item wide ' +
    ($blockType === 'bullet' ? 'active dropdown-item-active' : '')}
  onclick={() => formatBulletList(editor, $blockType)}>
  <div class="icon-text-container">
    <i class="icon bullet-list"></i>
    <span class="text">Bullet List</span>
  </div>
  <span class="shortcut">{SHORTCUTS.BULLET_LIST}</span>
</DropDownItem>
