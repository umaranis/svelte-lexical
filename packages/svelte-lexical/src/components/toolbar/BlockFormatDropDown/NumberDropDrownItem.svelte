<script lang="ts">
  import pkglist from '@lexical/list';
  const {INSERT_ORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND} = pkglist;
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../../core/composerContext';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatNumberedList = () => {
    if ($blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'number' ? 'active dropdown-item-active' : '')}
  on:click={formatNumberedList}>
  <i class="icon numbered-list" />
  <span class="text">Numbered List</span>
</DropDownItem>
