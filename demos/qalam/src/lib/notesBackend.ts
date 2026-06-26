import {
  readDir,
  readTextFile,
  writeTextFile,
  exists,
  mkdir,
  remove as removeFile,
} from '@tauri-apps/plugin-fs';
import {appDataDir, join} from '@tauri-apps/api/path';
import {isTauri} from '@tauri-apps/api/core';

export interface NoteFile {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesBackend {
  /** Resolves to a human-readable description of where notes are stored. */
  init(): Promise<string>;
  list(): Promise<Array<{id: string; data: NoteFile}>>;
  read(id: string): Promise<NoteFile>;
  write(id: string, data: NoteFile): Promise<void>;
  remove(id: string): Promise<void>;
}

function createTauriBackend(): NotesBackend {
  let notesDir = '';

  return {
    async init() {
      const appData = await appDataDir();
      notesDir = await join(appData, 'qalam');
      if (!(await exists(notesDir))) {
        await mkdir(notesDir, {recursive: true});
      }
      return notesDir;
    },

    async list() {
      const entries = await readDir(notesDir);
      const noteEntries = entries.filter((e) => e.name?.endsWith('.json'));

      const results: Array<{id: string; data: NoteFile}> = [];
      for (const entry of noteEntries) {
        try {
          const filePath = await join(notesDir, entry.name!);
          const raw = await readTextFile(filePath);
          results.push({
            id: entry.name!.replace('.json', ''),
            data: JSON.parse(raw),
          });
        } catch {
          // skip malformed files
        }
      }
      return results;
    },

    async read(id) {
      const filePath = await join(notesDir, `${id}.json`);
      return JSON.parse(await readTextFile(filePath));
    },

    async write(id, data) {
      const filePath = await join(notesDir, `${id}.json`);
      await writeTextFile(filePath, JSON.stringify(data, null, 2));
    },

    async remove(id) {
      const filePath = await join(notesDir, `${id}.json`);
      await removeFile(filePath);
    },
  };
}

const DB_NAME = 'qalam';
const STORE_NAME = 'notes';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = fn(db.transaction(STORE_NAME, mode).objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function createIndexedDbBackend(): NotesBackend {
  let db: IDBDatabase;

  return {
    async init() {
      db = await openDb();
      return 'Browser storage (IndexedDB) — notes are local to this browser';
    },

    async list() {
      const [keys, values] = await Promise.all([
        runTransaction(db, 'readonly', (store) => store.getAllKeys()),
        runTransaction(db, 'readonly', (store) => store.getAll()),
      ]);
      return keys.map((id, i) => ({id: String(id), data: values[i] as NoteFile}));
    },

    async read(id) {
      const data = await runTransaction(db, 'readonly', (store) => store.get(id));
      if (!data) throw new Error(`Note ${id} not found`);
      return data;
    },

    async write(id, data) {
      await runTransaction(db, 'readwrite', (store) => store.put(data, id));
    },

    async remove(id) {
      await runTransaction(db, 'readwrite', (store) => store.delete(id));
    },
  };
}

export function getNotesBackend(): NotesBackend {
  return isTauri() ? createTauriBackend() : createIndexedDbBackend();
}
