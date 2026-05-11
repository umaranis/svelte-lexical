<script lang="ts">
  import {onMount} from 'svelte';
  import Sidebar from './lib/Sidebar.svelte';
  import Editor from './lib/Editor.svelte';
  import {notesStore} from './lib/notesStore.svelte';

  onMount(async () => {
    await notesStore.init();
  });
</script>

<div class="app">
  <Sidebar />
  <main class="main-area">
    {#if notesStore.activeNote}
      {#key notesStore.activeNoteId}
        <Editor
          noteId={notesStore.activeNote.id}
          initialContent={notesStore.activeNoteContent}
          title={notesStore.activeNote.title} />
      {/key}
    {:else}
      <div class="welcome">
        <div class="welcome-content">
          <div class="welcome-icon">✦</div>
          <h1>Qalam</h1>
          <p>A distraction-free rich text editor for your notes.</p>
          <button class="cta-btn" onclick={() => notesStore.createNote()}>
            New Note
          </button>
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  .app {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .main-area {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .welcome {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
  }

  .welcome-content {
    text-align: center;
    color: #555;
  }

  .welcome-icon {
    font-size: 48px;
    color: #cba6f7;
    margin-bottom: 16px;
  }

  .welcome-content h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0 0 8px;
  }

  .welcome-content p {
    font-size: 15px;
    color: #888;
    margin: 0 0 24px;
  }

  .cta-btn {
    padding: 10px 24px;
    background: #cba6f7;
    color: #1e1e2e;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }

  .cta-btn:hover {
    background: #b48ef0;
  }
</style>
