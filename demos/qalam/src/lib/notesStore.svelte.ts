import {
  readDir,
  readTextFile,
  writeTextFile,
  exists,
  mkdir,
  remove,
} from '@tauri-apps/plugin-fs';
import {appDataDir, join} from '@tauri-apps/api/path';

export interface Note {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteFile {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function createNotesStore() {
  let notes = $state<Note[]>([]);
  let activeNoteId = $state<string | null>(null);
  let activeNoteContent = $state<string | null>(null);
  let notesDir = $state('');
  let isLoading = $state(false);
  let isSaving = $state(false);
  let isInitialized = $state(false);

  async function init() {
    if (isInitialized) return;
    const appData = await appDataDir();
    notesDir = await join(appData, 'qalam');

    const dirExists = await exists(notesDir);
    if (!dirExists) {
      await mkdir(notesDir, {recursive: true});
    }

    await loadNotes();
    isInitialized = true;
  }

  async function loadNotes() {
    isLoading = true;
    try {
      const entries = await readDir(notesDir);
      const noteEntries = entries.filter((e) => e.name?.endsWith('.json'));

      const loaded: Note[] = [];
      for (const entry of noteEntries) {
        try {
          const filePath = await join(notesDir, entry.name!);
          const raw = await readTextFile(filePath);
          const data: NoteFile = JSON.parse(raw);
          loaded.push({
            id: entry.name!.replace('.json', ''),
            title: data.title || 'Untitled',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        } catch {
          // skip malformed files
        }
      }

      notes = loaded.sort(
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

    const filePath = await join(notesDir, `${id}.json`);
    await writeTextFile(filePath, JSON.stringify(noteData, null, 2));

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
      const filePath = await join(notesDir, `${id}.json`);
      const raw = await readTextFile(filePath);
      const data: NoteFile = JSON.parse(raw);
      activeNoteId = id;
      activeNoteContent = data.content || null;
    } catch (e) {
      console.error(`Failed to open note ${id}:`, e);
    }
  }

  async function saveNoteContent(id: string, content: string) {
    isSaving = true;
    try {
      const filePath = await join(notesDir, `${id}.json`);
      const raw = await readTextFile(filePath);
      const data: NoteFile = JSON.parse(raw);
      const updated: NoteFile = {
        ...data,
        content,
        updatedAt: new Date().toISOString(),
      };
      await writeTextFile(filePath, JSON.stringify(updated, null, 2));

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
    const filePath = await join(notesDir, `${id}.json`);
    const raw = await readTextFile(filePath);
    const data: NoteFile = JSON.parse(raw);
    const updated: NoteFile = {
      ...data,
      title: newTitle,
      updatedAt: new Date().toISOString(),
    };
    await writeTextFile(filePath, JSON.stringify(updated, null, 2));

    notes = notes.map((n) =>
      n.id === id ? {...n, title: newTitle, updatedAt: updated.updatedAt} : n,
    );
  }

  async function deleteNote(id: string) {
    const filePath = await join(notesDir, `${id}.json`);
    await remove(filePath);
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
      return notesDir;
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
