<script lang="ts">
  import {onMount} from 'svelte';
  import {getRegisterItemFunc} from './utils.js';

  let className: string;
  export {className as class};
  export let title: string | undefined = undefined;
  export let ariaLabel: string | undefined = undefined;

  let ref: HTMLButtonElement;

  const registerItem = getRegisterItemFunc();

  if (registerItem === null) {
    throw new Error('DropDownItem must be used within a DropDown');
  }

  onMount(() => {
    registerItem(ref);
  });
</script>

<button
  class={className}
  on:click
  bind:this={ref}
  {title}
  type="button"
  aria-label={ariaLabel}>
  <slot />
</button>
