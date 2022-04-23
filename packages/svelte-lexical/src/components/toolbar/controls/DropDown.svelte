<script>
  let isDropDownOpen = false;
  let button;

  export let buttonLabel;
  export let buttonAriaLabel = null;
  export let buttonClassName;
  export let buttonIconClassName;

  function showDropdown() {
    isDropDownOpen = !isDropDownOpen;

    if (isDropDownOpen && button) {
      const handle = (event) => {
        if (button && !button.contains(event.target)) {
          isDropDownOpen = false;
          button.removeEventListener('click', handle);
        }
      };
      document.addEventListener('click', handle);
    }
  }
</script>

<button
  aria-label={buttonAriaLabel || buttonLabel}
  class={buttonClassName}
  on:click={showDropdown}
  bind:this={button}
>
  {#if buttonClassName}
    <span class={buttonIconClassName}/>
  {/if}
  {#if buttonLabel}
    <span class="text dropdown-button-text">{buttonLabel}</span>
  {/if}
  <i class="chevron-down" />
</button>

{#if isDropDownOpen}
  <div class="dropdown" style={`top: 45px;left:${button.offsetLeft}px`}>
    <slot />
  </div>
{/if}
