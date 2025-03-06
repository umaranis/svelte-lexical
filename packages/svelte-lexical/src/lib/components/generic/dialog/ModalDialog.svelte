<script lang="ts">
  import {
    run,
    self,
    createBubbler,
    stopPropagation as stopPropagation_1,
  } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    showModal: boolean;
    stopPropagation?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    showModal = $bindable(),
    stopPropagation = true,
    children,
  }: Props = $props();

  let dialog: HTMLDialogElement | undefined = $state();

  run(() => {
    if (dialog) {
      if (showModal) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog
  bind:this={dialog}
  onclose={() => (showModal = false)}
  onclick={self(() => dialog!.close())}>
  {#if stopPropagation}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div onclick={stopPropagation_1(bubble('click'))}>
      {@render children?.()}
    </div>
  {:else}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div onclick={bubble('click')}>
      {@render children?.()}
    </div>
  {/if}
</dialog>

<style>
  dialog {
    border-radius: 12px;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
