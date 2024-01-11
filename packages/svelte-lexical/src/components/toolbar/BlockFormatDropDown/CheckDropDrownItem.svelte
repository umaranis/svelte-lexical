<script lang="ts">
  import pkglist from '@lexical/list';
  const {INSERT_CHECK_LIST_COMMAND, REMOVE_LIST_COMMAND} = pkglist;
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../../core/composerContext';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatCheckList = () => {
    if ($blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'check' ? 'active dropdown-item-active' : '')}
  on:click={formatCheckList}>
  <i class="icon check-list" />
  <span class="text">Check List</span>
</DropDownItem>
