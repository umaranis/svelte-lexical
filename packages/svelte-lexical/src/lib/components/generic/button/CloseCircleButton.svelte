<script lang="ts">
  let {onclick = () => {}}: {onclick?: (event: MouseEvent) => void} = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
  {onclick}
  class="close-icon"
  viewBox="0 0 24 24"
  fill="currentColor"
  style="cursor: pointer;">
  <path
    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
</svg>
