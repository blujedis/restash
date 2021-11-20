import { KeyOf } from "src";
import { tryParseJSON, tryStringifyJSON } from "./utils";
import { promisify } from "util";

export type StorageCallback = (err?: Error, data?: any) => void;

export type Storage = ReturnType<typeof asyncStorage>;

function asyncStorage(storage: any) {

  const getItem = (key: string, cb: StorageCallback) => {
    if (typeof localStorage === 'undefined')
      return cb();
    try {
      const result = tryParseJSON(localStorage.getItem(key));
      cb(null, result);
    }
    catch (err) {
      cb(err as Error);
    }
  };

  const setItem = (key: string, value: any, cb: StorageCallback) => {
    if (typeof localStorage === 'undefined')
      return cb();
    try {
      const stringified = typeof value === 'string' ? value : tryStringifyJSON(value);
      if (stringified)
        localStorage.setItem(key, stringified);
      cb();
    }
    catch (err) {
      cb(err as Error);
    }
  };

  const removeItem = (key: string, cb: StorageCallback) => {
    if (typeof localStorage === 'undefined')
      return cb();
    try {
      localStorage.removeItem(key);
    }
    catch (err) {
      cb(err as Error);
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    ...storage
  } as { getItem: typeof getItem, setItem: typeof setItem, removeItem: typeof removeItem };

}

export function createStorage(storage: Storage) {

  storage = asyncStorage(storage);

  const getItem = promisify(storage.getItem);
  const setItem = promisify(storage.setItem);
  const removeItem = promisify(storage.removeItem);

  /**
   * Persists state to storage.
   * 
   * @param key the key used to set storage.
   * @param value the value to be set.
   * @param filters an array of keys to filter from persisted object.
   */
  async function setStorage<S extends Record<string, any>>(key: string, value: S, filters: KeyOf<S>[] = []) {
    if (typeof value === 'undefined' || value === null)
      return;
    // setTimeout(() => {
    if (filters.length)
      value = Object.keys(value).reduce((result, k) => {
        if (filters.includes(k as KeyOf<S>))
          result[k as keyof S] = value[k];
        return result;
      }, {} as S);
    // const stringified = tryStringifyJSON(value);
    // if (stringified)
    // storage.setItem(key, stringified);
    return setItem(key, value);
    // });
  }

  /**
   * Gets state from storage.
   * 
   * @param key the storage key to retrieve.
   * @param filters array of keys to filter.
   */
  async function getStorage<S extends Record<string, any>>(key: string, filters: KeyOf<S>[] = []) {
    // if (typeof localStorage === 'undefined')
    //   return null;
    // const parsed = tryParseJSON(storage.getItem(key)) as S;
    const parsed = await getItem(key);
    if (!filters.length || !parsed)
      return parsed;
    return Object.keys(parsed).reduce((result, k) => {
      if (filters.includes(k as KeyOf<S>))
        result[k as keyof S] = parsed[k];
      return result;
    }, {} as S);
  }

  /**
   * Clears entire storage for store or clears by defined filter key.
   * 
   * @param key the storage key for the store.
   * @param filters key filters to set.
   */
  async function clearStorage<S extends Record<string, any>>(key: string, filters: KeyOf<S>[] = []) {
    // if (typeof localStorage === 'undefined')
    //   return false;
    // if (!storage.removeItem) return false;
    if (!filters.length) {
      await removeItem(key);
      return true;
    }
    const current = await getStorage(key);
    setStorage<S>(key, current, filters);
    return true;
  }

  return {
    getStorage,
    setStorage,
    clearStorage
  };

}