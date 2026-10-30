<script lang="ts">
  import type {MenuOption} from './contextMenuHelpers.js';

  interface Props {
    index: number;
    isSelected: boolean;
    onclick: () => void;
    onmouseenter: () => void;
    option: MenuOption;
  }
  let {index, isSelected, onclick, onmouseenter, option}: Props = $props();

  let className = $derived('item' + (isSelected ? ' selected' : ''));
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
  {#if option.icon}
    <i class={option.icon}></i>
  {/if}
  <span class="text">{option.title}</span>
</li>
