<script lang="ts">
  import {CAN_USE_DOM} from '../../../environment/canUseDOM.js';
  import DropDownItems from './DropDownItems.svelte';

  export let disabled = false;
  export let buttonAriaLabel: string | undefined = undefined;
  export let buttonClassName: string;
  export let buttonIconClassName: string | undefined = undefined;
  export let buttonLabel: string | undefined = undefined;
  export let stopCloseOnClickSelf = false;
  export let title: string | undefined = undefined;

  let dropDownRef: HTMLDivElement;
  let buttonRef: HTMLButtonElement;
  let showDropDown = false;

  function handleClose() {
    showDropDown = false;
    if (buttonRef) {
      buttonRef.focus();
    }
  }

  $: if (showDropDown && buttonRef && dropDownRef) {
    const {top, left} = buttonRef.getBoundingClientRect();
    dropDownRef.style.top = `${top + 42}px`;
    dropDownRef.style.left = `${Math.min(
      left,
      window.innerWidth - dropDownRef.offsetWidth - 20,
    )}px`;
  }

  const handle = (event: MouseEvent) => {
    const target = event.target;
    if (stopCloseOnClickSelf) {
      if (dropDownRef && dropDownRef.contains(target as Node)) return;
    }
    if (!buttonRef.contains(target as Node)) {
      showDropDown = false;
    }
  };

  $: if (showDropDown) {
    document.addEventListener('click', handle);
  } else if (CAN_USE_DOM) {
    document.removeEventListener('click', handle);
  }
</script>

<button
  type="button"
  {disabled}
  aria-label={buttonAriaLabel || buttonLabel}
  class={buttonClassName}
  on:click={() => (showDropDown = !showDropDown)}
  bind:this={buttonRef}
  {title}>
  {#if buttonIconClassName}
    <span class={buttonIconClassName} />
  {/if}

  {#if buttonLabel}
    <span class="text dropdown-button-text">{buttonLabel}</span>
  {/if}

  <i class="chevron-down" />
</button>

{#if showDropDown}
  <DropDownItems bind:dropDownRef onClose={handleClose}>
    <slot />
  </DropDownItems>
{/if}
