<script lang="ts">
  import {$patchStyleText as patchStyleText} from '@lexical/selection';
  import {
    $getSelection as getSelection,
    $isRangeSelection as isRangeSelection,
  } from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getEditor} from '../../core/svelteContext';
  import DropDown from '../generic/dropdown/DropDown.svelte';
  import DropDownItem from '../generic/dropdown/DropDownItem.svelte';

  const FONT_SIZE_OPTIONS: [string, string][] = [
    ['10px', '10px'],
    ['11px', '11px'],
    ['12px', '12px'],
    ['13px', '13px'],
    ['14px', '14px'],
    ['15px', '15px'],
    ['16px', '16px'],
    ['17px', '17px'],
    ['18px', '18px'],
    ['19px', '19px'],
    ['20px', '20px'],
  ];

  const editor = getEditor();
  const value: Writable<string> = getContext('fontSize');
  const style = 'font-size';
  export let disabled: boolean;

  const handleClick = (option: string) => {
    editor.update(() => {
      const selection = getSelection();
      if (isRangeSelection(selection)) {
        patchStyleText(selection, {
          [style]: option,
        });
      }
    });
  };

  const buttonAriaLabel = 'Formatting options for font size';
</script>

<DropDown
  {disabled}
  buttonClassName={'toolbar-item ' + style}
  buttonLabel={$value}
  buttonIconClassName=""
  {buttonAriaLabel}>
  {#each FONT_SIZE_OPTIONS as [option, text]}
    <DropDownItem
      class={`item ${
        $value === option ? 'active dropdown-item-active' : ''
      } 'fontsize-item'`}
      on:click={() => handleClick(option)}>
      <span class="text">{text}</span>
    </DropDownItem>
  {/each}
</DropDown>
