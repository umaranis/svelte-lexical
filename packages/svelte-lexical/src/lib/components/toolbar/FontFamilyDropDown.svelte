<script lang="ts">
  import {$patchStyleText as patchStyleText} from '@lexical/selection';
  import {$getSelection as getSelection} from 'lexical';
  import {getContext} from 'svelte';
  import type {Writable} from 'svelte/store';
  import {getActiveEditor, getIsEditable} from '$lib/core/composerContext.js';
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

  const activeEditor = getActiveEditor();
  const value: Writable<string> = getContext('fontFamily');
  const style = 'font-family';
  const isEditable = getIsEditable();

  const handleClick = (option: string) => {
    $activeEditor.update(() => {
      const selection = getSelection();
      if (selection !== null) {
        patchStyleText(selection, {
          [style]: option,
        });
      }
    });
  };

  const buttonAriaLabel = 'Formatting options for font family';
</script>

<DropDown
  disabled={!$isEditable}
  buttonClassName={'toolbar-item ' + style}
  buttonLabel={$value}
  buttonIconClassName="icon block-type font-family"
  {buttonAriaLabel}>
  {#each FONT_FAMILY_OPTIONS as [option, text]}
    <DropDownItem
      class={`item ${$value === option ? 'active dropdown-item-active' : ''}`}
      onclick={() => handleClick(option)}>
      <span class="text">{text}</span>
    </DropDownItem>
  {/each}
</DropDown>
