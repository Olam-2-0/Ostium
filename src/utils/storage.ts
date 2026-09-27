/**
 * LocalStorage architecture with strict namespace isolation for MindVibe.
 */

export type StorageNamespace = 'user' | 'demo';

export const GLOBAL_KEYS = {
  demoMode: 'mindvibe:demoMode',
} as const;

export function getStorageKey(namespace: StorageNamespace, entity: string): string {
  return `mindvibe:${namespace}:${entity}`;
}

export function loadData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return defaultValue;
    }
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}", falling back to default`, err);
    return defaultValue;
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save localStorage key "${key}"`, err);
  }
}

export function removeData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Failed to remove localStorage key "${key}"`, err);
  }
}

export function clearNamespaceIfNeeded(namespace: StorageNamespace): void {
  const prefix = `mindvibe:${namespace}:`;
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
