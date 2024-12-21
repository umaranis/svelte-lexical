<script lang="ts">
  import {onMount} from 'svelte';
  import {getRegisterItemFunc} from './utils.js';

  interface Props {
    class: string;
    title?: string | undefined;
    ariaLabel?: string | undefined;
    onclick: () => void;
    children?: import('svelte').Snippet;
  }

  let {
    class: className,
    title = undefined,
    ariaLabel = undefined,
    onclick,
    children,
  }: Props = $props();

  let ref: HTMLButtonElement | undefined = $state();

  const registerItem = getRegisterItemFunc();

  if (registerItem === null) {
    throw new Error('DropDownItem must be used within a DropDown');
  }

  onMount(() => {
    registerItem(ref!);
  });
</script>

<button
  class={className}
  {onclick}
  bind:this={ref}
  {title}
  type="button"
  aria-label={ariaLabel}>
  {@render children?.()}
</button>
