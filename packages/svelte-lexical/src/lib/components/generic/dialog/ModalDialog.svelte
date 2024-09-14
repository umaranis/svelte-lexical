<script lang="ts">
  export let showModal: boolean;
  export let stopPropagation: boolean = true;

  let dialog: HTMLDialogElement;

  $: if (dialog) {
    if (showModal) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}>
  {#if stopPropagation}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click|stopPropagation>
      <slot />
    </div>
  {:else}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click>
      <slot />
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
