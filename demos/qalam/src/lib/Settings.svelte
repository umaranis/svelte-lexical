<script lang="ts">
  import {notesStore} from './notesStore.svelte';

  interface Props {
    onClose: () => void;
  }

  let {onClose}: Props = $props();
  let copied = $state(false);

  async function copyPath() {
    await navigator.clipboard.writeText(notesStore.notesDir);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  class="overlay"
  role="presentation"
  onclick={(e) => {
    if (e.target === e.currentTarget) onClose();
  }}>
  <div
    class="dialog"
    role="dialog"
    aria-modal="true"
    aria-labelledby="settings-title">
    <div class="dialog-header">
      <h2 id="settings-title">Settings</h2>
      <button class="close-btn" onclick={onClose} aria-label="Close">
        ×
      </button>
    </div>
    <div class="dialog-body">
      <label class="field-label" for="notes-path">Notes location</label>
      <div class="path-row">
        <input
          id="notes-path"
          class="path-input"
          value={notesStore.notesDir}
          readonly />
        <button class="copy-btn" onclick={copyPath}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .dialog {
    width: 480px;
    max-width: calc(100vw - 48px);
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e8e8e8;
  }

  .dialog-header h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .close-btn {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: #888;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    background: #f0f0f0;
  }

  .dialog-body {
    padding: 20px;
  }

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .path-row {
    display: flex;
    gap: 8px;
  }

  .path-input {
    flex: 1;
    min-width: 0;
    padding: 8px 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background: #f7f7f8;
    color: #333;
    font-size: 13px;
    font-family: ui-monospace, monospace;
  }

  .copy-btn {
    flex-shrink: 0;
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    background: #cba6f7;
    color: #1e1e2e;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .copy-btn:hover {
    background: #b48ef0;
  }
</style>
