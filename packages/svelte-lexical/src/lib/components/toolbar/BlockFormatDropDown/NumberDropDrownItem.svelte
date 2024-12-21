<script lang="ts">
  import {INSERT_ORDERED_LIST_COMMAND} from '@lexical/list';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName.js';
  import {formatParagraph} from './formatParagraph.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatNumberedList = () => {
    if ($blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph(editor);
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'number' ? 'active dropdown-item-active' : '')}
  onclick={formatNumberedList}>
  <i class="icon numbered-list"></i>
  <span class="text">Numbered List</span>
</DropDownItem>
