<script>
  import { getContext } from 'svelte';
  import { $patchStyleText as patchStyleText } from '@lexical/selection';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';
  import Select from './controls/Select.svelte';
  import { fontSize } from '../editor-state/StateStoreRichText';

  const editor = getContext('editor');

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
  class="toolbar-item font-size"
  on:change={(e) => applyStyleText({ 'font-size': e.target.value })}
  options={[
    '10px',
    '11px',
    '12px',
    '13px',
    '14px',
    '15px',
    '16px',
    '17px',
    '18px',
    '19px',
    '20px',
  ]}
  bind:value={$fontSize}
/>
<i class="chevron-down inside" />
