<script lang="ts">
  import {notesStore, type Note} from './notesStore.svelte';
  import Settings from './Settings.svelte';

  let editingId = $state<string | null>(null);
  let editingTitle = $state('');
  let inputEl = $state<HTMLInputElement | null>(null);
  let showSettings = $state(false);

  function startRename(note: Note) {
    editingId = note.id;
    editingTitle = note.title;
    setTimeout(() => inputEl?.select(), 0);
  }

  async function commitRename() {
    if (editingId && editingTitle.trim()) {
      await notesStore.renameNote(editingId, editingTitle.trim());
    }
    editingId = null;
  }

  function cancelRename() {
    editingId = null;
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    if (days === 1) return 'Yesterday';
    if (days < 7) return d.toLocaleDateString([], {weekday: 'short'});
    return d.toLocaleDateString([], {month: 'short', day: 'numeric'});
  }

  async function handleDelete(e: MouseEvent, id: string) {
    e.stopPropagation();
    if (confirm('Delete this note?')) {
      await notesStore.deleteNote(id);
    }
  }
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <span class="app-name">Qalam</span>
    <div class="header-actions">
      <button
        class="icon-btn"
        onclick={() => (showSettings = true)}
        title="Settings">
        ⚙
      </button>
      <button
        class="new-note-btn"
        onclick={() => notesStore.createNote()}
        title="New note">
        +
      </button>
    </div>
  </div>

  <div class="notes-list">
    {#if notesStore.isLoading}
      <div class="empty-message">Loading notes…</div>
    {:else if notesStore.notes.length === 0}
      <div class="empty-message">No notes yet.<br />Click + to create one.</div>
    {:else}
      {#each notesStore.notes as note (note.id)}
        <div
          class="note-item"
          class:active={notesStore.activeNoteId === note.id}
          role="button"
          tabindex="0"
          onclick={() => notesStore.openNote(note.id)}
          onkeydown={(e) => e.key === 'Enter' && notesStore.openNote(note.id)}>
          <div class="note-item-content">
            {#if editingId === note.id}
              <input
                bind:this={inputEl}
                class="rename-input"
                bind:value={editingTitle}
                onblur={commitRename}
                onkeydown={(e) => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                onclick={(e) => e.stopPropagation()} />
            {:else}
              <span
                class="note-title"
                ondblclick={(e) => {
                  e.stopPropagation();
                  startRename(note);
                }}>
                {note.title}
              </span>
            {/if}
            <span class="note-date">{formatDate(note.updatedAt)}</span>
          </div>
          <button
            class="delete-btn"
            onclick={(e) => handleDelete(e, note.id)}
            title="Delete note"
            tabindex="-1">
            ×
          </button>
        </div>
      {/each}
    {/if}
  </div>
</aside>

{#if showSettings}
  <Settings onClose={() => (showSettings = false)} />
{/if}

<style>
  .sidebar {
    width: 240px;
    min-width: 240px;
    height: 100%;
    background: #1e1e2e;
    color: #cdd6f4;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #313244;
    overflow: hidden;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 12px 12px;
    border-bottom: 1px solid #313244;
    flex-shrink: 0;
  }

  .app-name {
    font-size: 18px;
    font-weight: 700;
    color: #cba6f7;
    letter-spacing: 0.5px;
  }

  .header-actions {
    display: flex;
    gap: 6px;
  }

  .new-note-btn,
  .icon-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    background: #313244;
    color: #cdd6f4;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }

  .icon-btn {
    font-size: 14px;
  }

  .new-note-btn:hover,
  .icon-btn:hover {
    background: #45475a;
  }

  .notes-list {
    flex: 1;
    overflow-y: auto;
    padding: 6px 0;
  }

  .notes-list::-webkit-scrollbar {
    width: 4px;
  }

  .notes-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .notes-list::-webkit-scrollbar-thumb {
    background: #45475a;
    border-radius: 2px;
  }

  .empty-message {
    color: #6c7086;
    font-size: 13px;
    text-align: center;
    padding: 24px 16px;
    line-height: 1.6;
  }

  .note-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 6px;
    margin: 1px 6px;
    transition: background 0.1s;
    user-select: none;
    gap: 4px;
  }

  .note-item:hover {
    background: #313244;
  }

  .note-item.active {
    background: #313244;
  }

  .note-item.active .note-title {
    color: #cba6f7;
  }

  .note-item-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .note-title {
    font-size: 13px;
    font-weight: 500;
    color: #cdd6f4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .note-date {
    font-size: 11px;
    color: #6c7086;
  }

  .rename-input {
    width: 100%;
    background: #313244;
    border: 1px solid #cba6f7;
    border-radius: 4px;
    color: #cdd6f4;
    font-size: 13px;
    padding: 2px 4px;
    outline: none;
  }

  .delete-btn {
    opacity: 0;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: none;
    background: transparent;
    color: #6c7086;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.1s;
    padding: 0;
  }

  .note-item:hover .delete-btn {
    opacity: 1;
  }

  .delete-btn:hover {
    background: #f38ba8;
    color: #1e1e2e;
  }
</style>
