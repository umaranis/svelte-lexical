<script lang="ts">
  import {
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
  } from '@lexical/list';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../../core/composerContext';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatBulletList = () => {
    if ($blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'bullet' ? 'active dropdown-item-active' : '')}
  on:click={formatBulletList}>
  <i class="icon bullet-list" />
  <span class="text">Bullet List</span>
</DropDownItem>
