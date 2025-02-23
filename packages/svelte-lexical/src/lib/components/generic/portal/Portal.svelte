<script lang="ts">
  import {onMount, onDestroy} from 'svelte';

  interface Props {
    target?: HTMLElement | null | undefined;
    children?: import('svelte').Snippet;
    portalRef?: HTMLElement;
  }

  let {
    target = globalThis.document?.body,
    children,
    portalRef = $bindable(),
  }: Props = $props();

  onMount(() => {
    if (target) {
      target.appendChild(portalRef!);
    }
  });

  onDestroy(() => {
    if (portalRef?.parentNode) {
      portalRef.parentNode?.removeChild(portalRef);
    }
  });
</script>

<div bind:this={portalRef}>
  {@render children?.()}
</div>
