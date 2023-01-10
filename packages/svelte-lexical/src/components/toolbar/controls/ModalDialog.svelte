<script context="module">
  // source: https://svelte.dev/repl/514f1335749a4eae9d34ad74dc277f20?version=3.37.0

  let onTop; // keeping track of which open modal is on top
  const modals = {}; // all modals get registered here for easy future access

  // returns an object for the modal specified by `id`, which contains the API functions (`open` and `close`)
  export const getModal = (id = '') => modals[id];

  // TODO: clean up this multi-dialog dictionary mess, each dialog should work on its own
</script>

<script>
  import { onMount, onDestroy } from 'svelte';

  let topDiv;
  let visible = false;
  let prevOnTop;
  let closeCallback;

  export let id = '';

  let close;
  let handleKeydown;

  onMount(() => {
    handleKeydown = (ev) => {
      // only respond if the current modal is the top one
      if (ev.key === 'Escape' && onTop === topDiv) close(); // ESC
    };

    const open = (callback) => {
      closeCallback = callback;
      if (visible) return;
      prevOnTop = onTop;
      onTop = topDiv;
      window.addEventListener('keydown', handleKeydown);

      // this prevents scrolling of the main window on larger screens
      document.body.style.overflow = 'hidden';

      visible = true;
      // Move the modal in the DOM to be the last child of <body> so that it can be on top of everything
      document.body.appendChild(topDiv);
    };

    close = (retVal) => {
      if (!visible) return;
      window.removeEventListener('keydown', handleKeydown);
      onTop = prevOnTop;
      if (onTop == null) document.body.style.overflow = '';
      visible = false;
      if (closeCallback) closeCallback(retVal);
    };

    // expose the API
    modals[id] = { open, close };
  });

  onDestroy(() => {
    delete modals[id];
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<div id="topModal" class:visible bind:this={topDiv} on:click={() => close()}>
  <div id="modal" class="Modal__modal" on:click|stopPropagation={() => {}}>
    <svg id="close" on:click={() => close()} viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="6" />
      <line x1="3" y1="3" x2="9" y2="9" />
      <line x1="9" y1="3" x2="3" y2="9" />
    </svg>
    <div id="modal-content">
      <slot />
    </div>
  </div>
</div>

<style>
  /* TODO: reconcile below css with css from lexical playground in index.css */
  #topModal {
    visibility: hidden;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #4448;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #modal {
    position: relative;
    border-radius: 6px;
    background: white;
    /*border: 2px solid #000;*/
    filter: drop-shadow(5px 5px 5px #555);
    padding: 1em;
  }

  .visible {
    visibility: visible !important;
  }

  #close {
    position: absolute;
    top: -12px;
    right: -12px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    fill: #f44;
    transition: transform 0.3s;
  }

  #close:hover {
    transform: scale(2);
  }

  #close line {
    stroke: #fff;
    stroke-width: 2;
  }
  #modal-content {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow: auto;
  }
</style>
