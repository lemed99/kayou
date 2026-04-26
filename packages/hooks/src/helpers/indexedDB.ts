const isEmptyObject = (obj: unknown) =>
  !!obj && typeof obj === 'object' && Object.keys(obj).length === 0;

export const isValidCacheData = (data: unknown): boolean => {
  if (data && typeof data === 'string') return false;
  if (JSON.stringify(data) !== '[]' && isEmptyObject(data)) return false;
  if (
    data &&
    Array.isArray(data) &&
    data.length > 0 &&
    data.some((e: unknown) => !e || typeof e === 'string' || isEmptyObject(e))
  )
    return false;

  if (!data) return false;

  return true;
};

interface CacheRow {
  key: string;
  value: unknown;
}

class NativeCache {
  private dbName = 'CacheDatabase';
  private storeName = 'cache';
  private version = 1;
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () =>
        reject(new Error(request.error?.message || 'IndexedDB getAllKeys error'));
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'key' });
        }
      };
    });
  }

  async get(key: string, validator?: (data: unknown) => boolean): Promise<unknown> {
    if (!key) return null;

    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const validate = validator ?? isValidCacheData;

      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onerror = () =>
          reject(new Error(request.error?.message || 'IndexedDB getAllKeys error'));
        request.onsuccess = () => {
          const result = request.result as CacheRow;
          if (!result) {
            resolve(null);
            return;
          }

          if (!validate(result.value)) {
            resolve(null);
            return;
          }

          resolve(result.value);
        };
      });
    } catch (error) {
      console.warn('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.put({ key, value });
        request.onerror = () =>
          reject(new Error(request.error?.message || 'IndexedDB getAllKeys error'));
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      return new Promise((resolve, reject) => {
        const request = store.getAllKeys();
        request.onerror = () =>
          reject(new Error(request.error?.message || 'IndexedDB getAllKeys error'));
        request.onsuccess = () => resolve(request.result as string[]);
      });
    } catch (error) {
      console.warn('Cache getAllKeys error:', error);
      return [];
    }
  }

  async delete(): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      return new Promise((resolve, reject) => {
        const request = store.clear();
        request.onerror = () =>
          reject(new Error(request.error?.message || 'IndexedDB clear error'));
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }
}

export const cache = new NativeCache();

export const insertOrUpdateCacheRow = async (key: string, value: unknown) => {
  await cache.set(key, value);
};

export const getCacheRow = async (
  key: string,
  validator?: (data: unknown) => boolean,
): Promise<unknown> => {
  return cache.get(key, validator);
};
