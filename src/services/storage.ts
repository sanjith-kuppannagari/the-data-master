/**
 * LocalStorage wrapper with namespacing, version checking, and error resilience.
 */

const STORAGE_PREFIX = 'tdm_v1_';

const inMemoryFallback = new Map<string, string>();

function getStorageBackend(): {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  removeItem: (k: string) => void;
  keys: () => string[];
} {
  if (typeof window !== 'undefined' && window.localStorage) {
    return {
      getItem: (k: string) => window.localStorage.getItem(k),
      setItem: (k: string, v: string) => window.localStorage.setItem(k, v),
      removeItem: (k: string) => window.localStorage.removeItem(k),
      keys: () => {
        const arr: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k) arr.push(k);
        }
        return arr;
      },
    };
  }
  if (typeof localStorage !== 'undefined') {
    return {
      getItem: (k: string) => localStorage.getItem(k),
      setItem: (k: string, v: string) => localStorage.setItem(k, v),
      removeItem: (k: string) => localStorage.removeItem(k),
      keys: () => {
        const arr: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k) arr.push(k);
        }
        return arr;
      },
    };
  }
  return {
    getItem: (k: string) => inMemoryFallback.get(k) ?? null,
    setItem: (k: string, v: string) => { inMemoryFallback.set(k, v); },
    removeItem: (k: string) => { inMemoryFallback.delete(k); },
    keys: () => Array.from(inMemoryFallback.keys()),
  };
}

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const backend = getStorageBackend();
      const item = backend.getItem(`${STORAGE_PREFIX}${key}`);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[storage.get] Failed to parse key "${key}":`, error);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      const backend = getStorageBackend();
      backend.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[storage.set] Failed to persist key "${key}":`, error);
      return false;
    }
  },

  remove(key: string): void {
    try {
      const backend = getStorageBackend();
      backend.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error(`[storage.remove] Failed to remove key "${key}":`, error);
    }
  },

  clearAll(): void {
    try {
      const backend = getStorageBackend();
      const keysToRemove = backend.keys().filter(k => k.startsWith(STORAGE_PREFIX));
      keysToRemove.forEach(k => backend.removeItem(k));
    } catch (error) {
      console.error('[storage.clearAll] Failed to clear application storage:', error);
    }
  }
};
