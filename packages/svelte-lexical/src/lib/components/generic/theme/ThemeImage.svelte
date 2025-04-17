<script lang="ts">
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

  // Default to light theme for SSR
  let src = $state(lightSrc);

  // Update source when theme changes or on client-side initialization
  $effect(() => {
    if (themeTracker.color === 'dark') {
      src = darkSrc;
    } else {
      src = lightSrc;
    }
  });
</script>

<img {src} {alt} class={className} {style} />
