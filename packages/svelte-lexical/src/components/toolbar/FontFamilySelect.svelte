<script>
  import {$patchStyleText as patchStyleText} from '@lexical/selection';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';
  import Select from './controls/Select.svelte';
  import {fontFamily} from '../editor-state/StateStoreRichText';
  import {getEditor} from '../../core/svelteContext';

  const editor = getEditor();

  function applyStyleText(styles) {
    editor.update(() => {
      const selection = getSelection();
      if (isRangeSelection(selection)) {
        patchStyleText(selection, styles);
      }
    });
  }
</script>

<Select
  class="toolbar-item font-family"
  on:change={(e) => applyStyleText({'font-family': e.target.value})}
  options={[
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
  ]}
  bind:value={$fontFamily} />
<i class="chevron-down inside" />
