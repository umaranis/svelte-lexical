<script lang="ts">
  import {INSERT_CHECK_LIST_COMMAND, REMOVE_LIST_COMMAND} from '@lexical/list';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName.js';

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
