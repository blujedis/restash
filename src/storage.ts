
// TYPES //

export type Serializer = (value: any) => any;
export type Deserializer = Serializer;
export type MapStore<T = string> = Map<string, T>;
export type Store = Storage | MapStore;
export interface IObject<T = any> {
  [key: string]: T;
}

// HELPERS //

/**
 * Checks if a value is typeof undefined.
 * 
 * @param value the value to inspect if is undefined.
 */
function isUndefined(value: any) {
  return typeof value === 'undefined';
}

/**
 * Checks if a value is an object.
 * 
 * @param value the value to inpsect as an object.
 */
function isObject(value: any) {
  return value !== null && typeof value === 'object';
}

/**
 * Checks if a value is valid JSON.
 * 
 * @param value the value to inspect as JSON.
 */
function isJSON(value: any) {
  try {
    return JSON.parse(value);
  }
  catch (ex) {
    return false;
  }
}

/**
 * Serializes value to be stored.
 * 
 * @param value the value to serialize.
 */
function defaultSerializer(value: any) {
  if (value instanceof Date)
    return value;
  return JSON.stringify(value);
}

/**
 * Deserialize value from store.
 * 
 * @param value the value to be deserialized.
 */
function defaultDeserializer(value: any) {
  if (value instanceof Date)
    return value;
  const result = isJSON(value);
  if (isUndefined(result))
    throw new Error(`Failed to deserialize value ${value}`);
  return result;
}

/**
 * Checks if a value is a plain object literal.
 * 
 * @param value the value to inspect as object literal.
 */
function isPlainObject(value: any) {
  return isObject(value)
    && value.constructor === Object
    && Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Checks if value is an instance of a Date.
 * 
 * @param value the value to be inspected.
 */
function isDate(value: any) {
  return (value instanceof Date);
}

/**
 * Flattens an array.
 * 
 * @param arr the array to be flattened.
 */
function flatten<T = any>(arr: any[]): T[] {
  return arr.reduce(function (result, current) {
    current = Array.isArray(current) ? flatten(current) : [current];
    return [...result, ...current];
  }, []);
}

/**
 * Loosely checking if window/localStorage available.
 */
function isLocalStorage() {
  return typeof localStorage !== undefined;
}


class JsonStore<S extends Store> {

  private _store: S;
  private _isStorage: boolean;

  serialize: Serializer;
  deserialize: Deserializer;

  constructor(
    store: Store = new Map<string, string>(),
    serializer: Serializer = defaultSerializer,
    deserializer: Deserializer = defaultDeserializer) {
    this._store = store as any;
    this.serialize = serializer;
    this.deserialize = deserializer;
    this._isStorage = typeof (this._store as Storage).getItem === 'function';
  }

  /**
   * Checks if store contains key.
   * 
   * @param key the key to check if exists.
   */
  has(key: string) {
    return this._isStorage ? (this._store as Storage).hasOwnProperty(key) : (this._store as MapStore).has(key);
  }

  /**
   * Gets a value from store by key.
   * 
   * @param key the key to get from store.
   * @param def when no value is found set from default value.
   */
  get<T = any>(key: string, def?: T): T {

    let value;

    try {
      if (this._isStorage)
        value = (this._store as Storage).getItem(key);
      else
        value = (this._store as MapStore).get(key);
    }
    catch (ex) {
      value = null;
    }

    if (typeof value === 'string')
      return this.deserialize(value);

    if (typeof def !== 'undefined') {
      const setResult = this.set(key, def);
      if (setResult !== null)
        return def;
    }

    return value;

  }

  /**
   * Sets a value in the store.
   * 
   * @param key the key to be set.
   * @param value the value to set for key.
   */
  set(key: string, value: any): string {

    try {
      value = this.serialize(value);
      if (this._isStorage)
        value = (this._store as Storage).setItem(key, value);
      else
        value = (this._store as MapStore).set(key, value);
    }
    catch (ex) {
      value = null;
    }

    return value;

  }

  /**
   * Gets all keys in store or all keys except those excluded.
   * 
   * @param exclude the keys to exclude if any.
   */
  keys(exclude: string[]): string[];

  /**
   * Gets all keys in store or all keys except those excluded.
   * 
   * @param exclude the keys to exclude if any.
   */
  keys(...exclude: string[]): string[];

  /**
   * Gets all keys in store.
   */
  keys(): string[];
  keys(...exclude: (string | string[])[]) {
    const _keys = this._isStorage ? Object.keys(this._store) : [...(this._store as MapStore).keys()];
    if (!exclude.length)
      return _keys || [];
    return _keys.filter(k => exclude.includes(k));
  }

  /**
   * Gets values for all keys except the specified excluded keys.
   * 
   * @param keys the store keys to get values for.
   * @param omit when true get values except specified keys.
   */
  values<T = any>(keys: string[], omit?: boolean): T[];

  /**
   * Gets values for the specified keys.
   * 
   * @param keys get values for the specified keys.
   */
  values<T = any>(...keys: string[]): T[];

  /**
   * Gets values for all keys.
   */
  values<T = any>(): T[];
  values<T = any>(...keys: (string | string[] | boolean)[]): T[] {
    // If omit get all keys except those specified.
    if (typeof keys[keys.length - 1] === 'boolean')
      keys = this.keys((keys as any[]).slice(0, keys.length - 1));
    return (keys as string[]).map(k => this.get(k));
  }

  /**
   * Removes a key from the store.
   * 
   * @param key the key to be removed.
   */
  remove(key: string) {
    let removed;
    // Storage remove item is void so check if even has key.
    if (this._isStorage) {
      removed = this.has(key);
      (this._store as Storage).removeItem(key);
    }
    else {
      removed = (this._store as MapStore).delete(key);
    }
    return removed;
  }

  /**
   * Iterates each key value in store.
   * 
   * @param fn the handler for iterating key/values.
   */
  forEach(fn: (value: string, key?: string) => void) {
    if (this._isStorage)
      this.keys().forEach(k => {
        fn(this.get(k), k);
      });
    else
      (this._store as MapStore).forEach(fn);
    return this;
  }

  /**
   * Converts keys to an object literal for the specified keys.
   * 
   * @param keys the keys to create the object for.
   */
  toObject<T = any>(keys: string[]): IObject<T>;

  /**
   * Converts keys to an object literal for the specified keys.
   * 
   * @param keys the keys to create the object for.
   */
  toObject<T = any>(...keys: string[]): IObject<T>;

  /**
   * Converts keys to an object literal for all keys.
   */
  toObject<T = any>(): IObject<T>;
  toObject<T = any>(...keys: (string | string[])[]): IObject<T> {
    keys = !keys.length ? this.keys() : keys;
    return (keys as string[]).reduce((a, c) => {
      a[c] = this.get(c);
      return a;
    }, {});
  }

  /**
   * Creates a new Map<string, any>() for specified keys.
   * 
   * @param keys options keys to create map for.
   */
  toMap<T = any>(keys: string[]): MapStore<T>;

  /**
   * Creates a new Map<string, any>() for specified keys.
   * 
   * @param keys options keys to create map for.
   */
  toMap<T = any>(...keys: string[]): MapStore<T>;

  /**
   * Creates a new Map<string, any>() for all keys.
   */
  toMap<T = any>(): MapStore<T>;
  toMap<T = any>(...keys: (string | string[])[]): MapStore<T> {
    const map = new Map<string, any>();
    keys = !keys.length ? this.keys() : keys;
    (keys as string[]).forEach(k => {
      map.set(k, this.get(k));
    });
    return map;
  }

  /**
   * Creates an array collection of [key, value] for specified keys.
   * 
   * @param keys the optional keys to create collection for.
   */
  toCollection<T = any>(keys: string[]): [string, T][];

  /**
   * Creates an array collection of [key, value] for specified keys.
   * 
   * @param keys the optional keys to create collection for.
   */
  toCollection<T = any>(...keys: string[]): [string, T][];

  /**
   * Creates an array collection of [key, value] for all keys.
   */
  toCollection<T = any>(): [string, T][];
  toCollection<T = any>(...keys: (string | string[])[]): [string, T][] {
    keys = !keys.length ? this.keys() : keys;
    return (keys as string[]).map(k => {
      return [k, this.get(k)];
    });
  }

  /**
   * Gets the size of the store.
   */
  size() {
    return this._isStorage ? this.keys().length : (this._store as MapStore).size;
  }

  /**
   * Clears the store.
   */
  clear() {
    this._store.clear();
    return this;
  }

}

const stores = {
  get local() {
    if (isLocalStorage())
      return new JsonStore(localStorage);
    return null;
  },
  get session() {
    if (isLocalStorage()) // assume session avail also.
      return new JsonStore(localStorage);
    return null;
  }
};

export default stores;
