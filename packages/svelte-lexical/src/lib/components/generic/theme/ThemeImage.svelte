<script lang="ts">
  import {onMount} from 'svelte';
  import {themeTracker} from './themeTracker.svelte.js';

  interface Props {
    lightSrc: string;
    darkSrc: string;
    alt: string;
    class?: string;
    style?: string;
  }

  let {
    lightSrc,
    darkSrc,
    alt,
    class: className = '',
    style = '',
  }: Props = $props();

  let src = $derived.by(() => {
    if (themeTracker.color === 'dark') {
      return darkSrc;
    } else {
      return lightSrc;
    }
  });

  // Update source on client-side initialization
  onMount(() => {
    src = ''; // this is required to avoid: hydration_attribute_changed (The client value will be ignored in favour of the server value)
    if (themeTracker.color === 'dark') {
      src = darkSrc;
    } else {
      src = lightSrc;
    }
  });
</script>

<img {src} {alt} class={className} {style} />
