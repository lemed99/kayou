import Dexie from 'dexie';

export const isEmptyObject = (obj: unknown) =>
  !!obj && typeof obj === 'object' && Object.keys(obj).length === 0;

const isValidCacheData = (data: unknown): boolean => {
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

class CacheDatabase extends Dexie {
  cache!: Dexie.Table<CacheRow, string>;
}

export const indexedDB = new CacheDatabase('CacheDatabase');
indexedDB.version(1).stores({
  cache: 'key, value',
});

export const insertOrUpdateCacheRow = async (key: string, value: unknown) => {
  const keys = await indexedDB.cache.orderBy('key').uniqueKeys();
  if (keys.includes(key)) {
    try {
      await indexedDB.cache.update(key, {
        value: value,
      });
    } catch (error) {
      console.warn(error);
    }
  } else {
    try {
      await indexedDB.cache.add({
        key,
        value,
      });
    } catch (error) {
      console.warn(error);
    }
  }
};

export const getCacheRow = async (key: string): Promise<unknown> => {
  if (!key) return null;
  const data = await indexedDB.cache.where('key').equals(key).first();
  if (!data) return null;
  if (!isValidCacheData(data.value)) return null;
  return data.value;
};
