import {getNotesBackend, type NoteFile} from './notesBackend';

export interface Note {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

function createNotesStore() {
  const backend = getNotesBackend();

  let notes = $state<Note[]>([]);
  let activeNoteId = $state<string | null>(null);
  let activeNoteContent = $state<string | null>(null);
  let notesLocation = $state('');
  let isLoading = $state(false);
  let isSaving = $state(false);
  let isInitialized = $state(false);

  async function init() {
    if (isInitialized) return;
    notesLocation = await backend.init();
    await loadNotes();
    isInitialized = true;
  }

  async function loadNotes() {
    isLoading = true;
    try {
      const entries = await backend.list();
      notes = entries
        .map(({id, data}) => ({
          id,
          title: data.title || 'Untitled',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
    } finally {
      isLoading = false;
    }
  }

  async function createNote() {
    const id = `note_${Date.now()}`;
    const now = new Date().toISOString();
    const noteData: NoteFile = {
      title: 'Untitled',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    await backend.write(id, noteData);

    const newNote: Note = {
      id,
      title: 'Untitled',
      createdAt: now,
      updatedAt: now,
    };
    notes = [newNote, ...notes];

    await openNote(id);
  }

  async function openNote(id: string) {
    try {
      const data = await backend.read(id);
      activeNoteId = id;
      activeNoteContent = data.content || null;
    } catch (e) {
      console.error(`Failed to open note ${id}:`, e);
    }
  }

  async function saveNoteContent(id: string, content: string) {
    isSaving = true;
    try {
      const data = await backend.read(id);
      const updated: NoteFile = {
        ...data,
        content,
        updatedAt: new Date().toISOString(),
      };
      await backend.write(id, updated);

      notes = notes
        .map((n) => (n.id === id ? {...n, updatedAt: updated.updatedAt} : n))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
    } finally {
      isSaving = false;
    }
  }

  async function renameNote(id: string, newTitle: string) {
    const data = await backend.read(id);
    const updated: NoteFile = {
      ...data,
      title: newTitle,
      updatedAt: new Date().toISOString(),
    };
    await backend.write(id, updated);

    notes = notes.map((n) =>
      n.id === id ? {...n, title: newTitle, updatedAt: updated.updatedAt} : n,
    );
  }

  async function deleteNote(id: string) {
    await backend.remove(id);
    notes = notes.filter((n) => n.id !== id);

    if (activeNoteId === id) {
      activeNoteId = null;
      activeNoteContent = null;
    }
  }

  return {
    get notes() {
      return notes;
    },
    get notesDir() {
      return notesLocation;
    },
    get activeNoteId() {
      return activeNoteId;
    },
    get activeNote() {
      return notes.find((n) => n.id === activeNoteId) ?? null;
    },
    get activeNoteContent() {
      return activeNoteContent;
    },
    get isLoading() {
      return isLoading;
    },
    get isSaving() {
      return isSaving;
    },
    get isInitialized() {
      return isInitialized;
    },
    init,
    createNote,
    openNote,
    saveNoteContent,
    renameNote,
    deleteNote,
  };
}

export const notesStore = createNotesStore();
