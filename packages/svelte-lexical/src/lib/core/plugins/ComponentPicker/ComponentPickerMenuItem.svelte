<script lang="ts">
  import type {ComponentPickerOption} from './ComponentPickerOption.js';

  interface Props {
    index: number;
    isSelected: boolean;
    onclick: () => void;
    onmouseenter: () => void;
    option: ComponentPickerOption;
  }
  let {
    index,
    isSelected,
    onclick,
    onmouseenter: onmouseenter,
    option,
  }: Props = $props();

  let className = 'item' + (isSelected ? ' selected' : '');
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<li
  tabIndex={-1}
  class={className}
  bind:this={option.ref}
  role="option"
  aria-selected={isSelected}
  id={'typeahead-item-' + index}
  {onmouseenter}
  {onclick}>
  <i class={option.icon}></i>
  <span class="text">{option.title}</span>
</li>
