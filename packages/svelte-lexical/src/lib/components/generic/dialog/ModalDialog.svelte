<script lang="ts">
  interface Props {
    showModal: boolean;
    stopPropagation?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }

  let {
    showModal = $bindable(),
    stopPropagation = true,
    onclick,
    children,
  }: Props = $props();

  let dialog: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (!dialog) return;

    if (showModal) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  });

  function handleDialogClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      dialog?.close();
    }
  }

  function handleContentClick(event: MouseEvent) {
    if (stopPropagation) {
      event.stopPropagation();
    }
    onclick?.(event);
  }
</script>

{#if showModal}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <dialog
    bind:this={dialog}
    onclose={() => (showModal = false)}
    onclick={handleDialogClick}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div onclick={handleContentClick}>
      {@render children?.()}
    </div>
  </dialog>
{/if}

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
