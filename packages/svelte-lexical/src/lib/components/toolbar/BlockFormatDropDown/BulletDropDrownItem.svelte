<script lang="ts">
  import {INSERT_UNORDERED_LIST_COMMAND} from '@lexical/list';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName.js';
  import {formatParagraph} from './formatParagraph.js';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatBulletList = () => {
    if ($blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph(editor);
    }
  };
</script>

<DropDownItem
  class={'item ' +
    ($blockType === 'bullet' ? 'active dropdown-item-active' : '')}
  onclick={formatBulletList}>
  <i class="icon bullet-list"></i>
  <span class="text">Bullet List</span>
</DropDownItem>
