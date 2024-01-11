<script lang="ts">
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../../core/composerContext';
  import DropDownItem from '../../generic/dropdown/DropDownItem.svelte';
  import type {blockTypeToBlockName} from './blockTypeToBlockName';
  import pkgSelection from '@lexical/selection';
  const {$setBlocksType: setBlocksType} = pkgSelection;
  import pkgLx from 'lexical';
  const {
    $getSelection: getSelection,
    $isRangeSelection: isRangeSelection,
    DEPRECATED_$isGridSelection,
  } = pkgLx;
  import pkgcode from '@lexical/code';
  const {$createCodeNode: createCodeNode} = pkgcode;

  const blockType: Writable<keyof typeof blockTypeToBlockName> =
    getContext('blockType');
  const editor = getEditor();

  const formatCode = () => {
    if ($blockType !== 'code') {
      editor.update(() => {
        let selection = getSelection();

        if (
          isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
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
  on:click={formatCode}>
  <i class="icon code" />
  <span class="text">Code Block</span>
</DropDownItem>
