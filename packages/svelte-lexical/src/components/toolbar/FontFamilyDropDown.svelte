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

  const FONT_FAMILY_OPTIONS: [string, string][] = [
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Verdana', 'Verdana'],
  ];

  const editor = getEditor();
  const value: Writable<string> = getContext('fontFamily');
  const style = 'font-family';
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

  const buttonAriaLabel = 'Formatting options for font family';
</script>

<DropDown
  {disabled}
  buttonClassName={'toolbar-item ' + style}
  buttonLabel={$value}
  buttonIconClassName="icon block-type font-family"
  {buttonAriaLabel}>
  {#each FONT_FAMILY_OPTIONS as [option, text]}
    <DropDownItem
      class={`item ${$value === option ? 'active dropdown-item-active' : ''}`}
      on:click={() => handleClick(option)}>
      <span class="text">{text}</span>
    </DropDownItem>
  {/each}
</DropDown>
