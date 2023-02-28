<script lang="ts">
  import {onMount} from 'svelte';
  import {setRegisterItemFunc} from './utils';

  export let onClose: () => void;
  export let dropDownRef: HTMLDivElement;

  let items: Array<HTMLButtonElement> = [];
  let highlightedItem: HTMLButtonElement | null = null;

  function registerItem(itemRef: HTMLButtonElement) {
    items.push(itemRef);
    items = items;
  }
  setRegisterItemFunc(registerItem);

  function handleKeyDown(event: KeyboardEvent) {
    if (!items) return;

    const key = event.key;

    if (['Escape', 'ArrowUp', 'ArrowDown', 'Tab'].includes(key)) {
      event.preventDefault();
    }

    if (key === 'Escape' || key === 'Tab') {
      onClose();
    } else if (key === 'ArrowUp') {
      if (highlightedItem === null) {
        highlightedItem = items[0];
      } else {
        const index = items.indexOf(highlightedItem) - 1;
        highlightedItem = items[index === -1 ? items.length - 1 : index];
      }
    } else if (key === 'ArrowDown') {
      if (highlightedItem === null) {
        highlightedItem = items[0];
      } else {
        const index = items.indexOf(highlightedItem) + 1;
        highlightedItem = items[index >= items.length ? 0 : index];
      }
    }
  }

  onMount(() => {
    if (!highlightedItem) {
      highlightedItem = items[0];
    }
  });

  $: if (highlightedItem) {
    highlightedItem.focus();
  }
</script>

<div class="dropdown" bind:this={dropDownRef} on:keydown={handleKeyDown}>
  <slot />
</div>
