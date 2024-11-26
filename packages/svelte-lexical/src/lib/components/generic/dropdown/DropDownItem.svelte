<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import {onMount} from 'svelte';
  import {getRegisterItemFunc} from './utils.js';

  
  interface Props {
    class: string;
    title?: string | undefined;
    ariaLabel?: string | undefined;
    children?: import('svelte').Snippet;
  }

  let {
    class: className,
    title = undefined,
    ariaLabel = undefined,
    children
  }: Props = $props();

  let ref: HTMLButtonElement = $state();

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
  onclick={bubble('click')}
  bind:this={ref}
  {title}
  type="button"
  aria-label={ariaLabel}>
  {@render children?.()}
</button>
