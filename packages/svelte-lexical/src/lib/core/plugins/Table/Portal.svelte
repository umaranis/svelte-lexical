<script lang="ts">
  import {onMount, onDestroy} from 'svelte';

  export let target: HTMLElement | null | undefined = globalThis.document?.body;

  let ref: HTMLElement;

  onMount(() => {
    if (target) {
      target.appendChild(ref);
    }
  });

  onDestroy(() => {
    if (ref?.parentNode) {
      ref.parentNode?.removeChild(ref);
    }
  });
</script>

<div bind:this={ref}>
  <slot />
</div>
