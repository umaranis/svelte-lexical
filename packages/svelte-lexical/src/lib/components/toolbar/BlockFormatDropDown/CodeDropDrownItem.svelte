<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '$lib/core/composerContext.js';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName.js';
  import {$setBlocksType as setBlocksType} from '@lexical/selection';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';
  import {$createCodeNode as createCodeNode} from '@lexical/code';

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatCode = () => {
    if ($blockType !== 'code') {
      editor.update(() => {
        let selection = getSelection();

        if (selection !== null) {
          if (selection.isCollapsed()) {
            setBlocksType(selection, () => createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = createCodeNode();
            selection.insertNodes([codeNode]);
            selection = getSelection();
            if (isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };
</script>

<DropDownItem
  class={'item ' + ($blockType === 'code' ? 'active dropdown-item-active' : '')}
  onclick={formatCode}>
  <i class="icon code"></i>
  <span class="text">Code Block</span>
</DropDownItem>
