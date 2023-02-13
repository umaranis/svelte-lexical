<script lang="ts">
  import {$patchStyleText as patchStyleText} from '@lexical/selection';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';
  import Select from './controls/Select.svelte';
  import {getEditor} from '../../core/svelteContext';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';

  const editor = getEditor();
  const fontFamily: Writable<string> = getContext('fontFamily');

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
