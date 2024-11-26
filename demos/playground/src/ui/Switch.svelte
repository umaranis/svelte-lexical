<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    checked: boolean;
    text: string;
    id?: string | undefined;
  }

  let { checked, text, id = undefined }: Props = $props();

  const buttonId = 'id_' + Math.floor(Math.random() * 10000);
</script>

<div class="switch" {id}>
  <label for={buttonId}>{text}</label>
  <button
    role="switch"
    aria-checked={checked ? 'true' : 'false'}
    id={buttonId}
    onclick={bubble('click')}>
    <span></span>
  </button>
</div>
