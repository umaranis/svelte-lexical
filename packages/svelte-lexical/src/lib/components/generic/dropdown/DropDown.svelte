<script lang="ts">
  import {run} from 'svelte/legacy';

  import {CAN_USE_DOM} from '@lexical/utils';
  import DropDownItems from './DropDownItems.svelte';
  import Portal from '../portal/Portal.svelte';
  import {isDOMNode} from 'lexical';

  interface Props {
    disabled?: boolean;
    buttonAriaLabel?: string | undefined;
    buttonClassName: string;
    buttonIconClassName?: string | undefined;
    buttonLabel?: string | undefined;
    stopCloseOnClickSelf?: boolean;
    title?: string | undefined;
    target?: HTMLElement;
    children?: import('svelte').Snippet;
  }

  let {
    disabled = false,
    buttonAriaLabel = undefined,
    buttonClassName,
    buttonIconClassName = undefined,
    buttonLabel = undefined,
    stopCloseOnClickSelf = false,
    title = undefined,
    children,
    target = undefined,
  }: Props = $props();

  let dropDownRef = $state<HTMLDivElement | undefined>();
  let buttonRef: HTMLButtonElement;
  let showDropDown = $state(false);

  function handleClose() {
    showDropDown = false;
    if (buttonRef) {
      buttonRef.focus();
    }
  }

  run(() => {
    if (showDropDown && buttonRef && dropDownRef) {
      const {top, left} = buttonRef.getBoundingClientRect();
      dropDownRef.style.top = `${top + 42}px`;
      dropDownRef.style.left = `${Math.min(
        left,
        window.innerWidth - dropDownRef.offsetWidth - 20,
      )}px`;
    }
  });

  const handle = (event: MouseEvent) => {
    const target = event.target;
    if (!isDOMNode(target)) {
      return;
    }
    if (stopCloseOnClickSelf) {
      if (dropDownRef && dropDownRef.contains(target)) return;
    }
    if (buttonRef && !buttonRef.contains(target)) {
      showDropDown = false;
    }
  };

  run(() => {
    if (showDropDown) {
      document.addEventListener('click', handle);
    } else if (CAN_USE_DOM) {
      document.removeEventListener('click', handle);
    }
  });
</script>

<button
  type="button"
  {disabled}
  aria-label={buttonAriaLabel || buttonLabel}
  class={buttonClassName}
  onclick={() => (showDropDown = !showDropDown)}
  bind:this={buttonRef}
  {title}>
  {#if buttonIconClassName}
    <span class={buttonIconClassName}></span>
  {/if}

  {#if buttonLabel}
    <span class="text dropdown-button-text">{buttonLabel}</span>
  {/if}

  <i class="chevron-down"></i>
</button>

{#if showDropDown}
  <Portal {target}>
    <DropDownItems bind:dropDownRef onClose={handleClose}>
      {@render children?.()}
    </DropDownItems>
  </Portal>
{/if}
