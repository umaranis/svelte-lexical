<script lang="ts">
  import DropDownItems from './DropDownItems.svelte';

  export let disabled = false;
  export let buttonAriaLabel: string | undefined = undefined;
  export let buttonClassName: string;
  export let buttonIconClassName: string | undefined = undefined;
  export let buttonLabel: string | undefined = undefined;
  export let stopCloseOnClickSelf: boolean | undefined = undefined;

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
    dropDownRef.style.top = `45px`;
    dropDownRef.style.left = `${buttonRef.offsetLeft}px`;
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
  } else {
    document.removeEventListener('click', handle);
  }
</script>

<button
  {disabled}
  aria-label={buttonAriaLabel || buttonLabel}
  class={buttonClassName}
  on:click={() => (showDropDown = !showDropDown)}
  bind:this={buttonRef}>
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
