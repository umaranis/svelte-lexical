/**
 * IndexedDB utility for persisting editor state
 */

const DB_NAME = 'svelte-lexical-db';
const DB_VERSION = 1;
const STORE_NAME = 'editor-content';
const CONTENT_KEY = 'editor-state';

/**
 * Opens the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open database'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Saves editor state to IndexedDB
 * @param {string} editorState - JSON stringified editor state
 * @returns {Promise<void>}
 */
export async function saveEditorState(editorState) {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(editorState, CONTENT_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to save editor state'));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error saving to IndexedDB:', error);
    throw error;
  }
}

/**
 * Loads editor state from IndexedDB
 * @returns {Promise<string|null>} JSON stringified editor state or null if not found
 */
export async function loadEditorState() {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CONTENT_KEY);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to load editor state'));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error loading from IndexedDB:', error);
    return null;
  }
}

/**
 * Clears the editor state from IndexedDB
 * @returns {Promise<void>}
 */
export async function clearEditorState() {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(CONTENT_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear editor state'));
      };

      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error clearing from IndexedDB:', error);
    throw error;
  }
}
