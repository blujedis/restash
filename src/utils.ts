import { Path } from './types';
import { get, delete as del, set } from 'dot-prop';

/**
 * Validates iniital state type.
 * 
 * @param initialState the initialState to be validated.
 */
export function validateState<S = any>(initialState: S) {
  if (initialState && (typeof initialState !== 'object' || Array.isArray(initialState) || initialState === null)) {
    const type = initialState === null ? 'null' : Array.isArray(initialState) ? 'Array' : typeof initialState;
    throw new Error(`Restash initialState must be of type object but got ${type}`);
  }
}

/**
 * Gets the initialiState by passed in value or value from window if using SSR.
 * 
 * @param initialState the initial state passed in manually.
 * @param stateKey the key on the window to use if avail (ssr ONLY).
 */
export function getInitialState<S = any>(initialState: S, stateKey: string) {
  if (typeof window === 'undefined' || (window && !window[stateKey]))
    return initialState || {};
  return { ...initialState, ...window[stateKey] };
}

/**
 * Internal function to thunkify middleware.
 */
export function thunkify() {
  return store => next => payload => {
    const [state] = payload;
    if (typeof state === 'function') {
      const { dispatch, getState } = store;
      return state(dispatch, getState);
    }
    return next(payload);
  };
}

/**
 * Middleware to unwrap payload to match raw dispatch signature.
 */
export function unwrap() {
  return store => next => payload => {
    const [state] = payload;
    if (typeof state === 'function') {
      const { dispatch, getState } = store;
      return state(dispatch, getState);
    }
    return next(...payload);
  };
}

/**
 * Checks if is string.
 * 
 * @param value the value to inspect.
 */
export function isString(value: unknown) {
  return typeof value === 'string';
}

/**
 * Checks if is of type Symbol.
 * 
 * @param value the value to inspect.
 */
export function isSymbol(value: unknown) {
  return typeof value === 'symbol';
}

/**
 * Checks if is undefined.
 * 
 * @param value the value to inspect.
 */
export function isUndefined(value: unknown) {
  return typeof value === 'undefined';
}

/**
 * Checks if is null or undefined.
 * 
 * @param value the value to inspect.
 */
export function isNullOrUndefined(value: unknown) {
  return value === null || isUndefined(value);
}

/**
 * Checks if is function
 * 
 * @param value the value to inspect.
 */
export function isFunction(value: unknown) {
  return typeof value === 'function';
}

/**
 * Checks if is an object.
 * 
 * @param value the value to inspect.
 */
export function isObject(value: unknown) {
  return !isNullOrUndefined(value) &&
    typeof value === 'object';
}

/**
 * Checks if is a plain object.
 * 
 * @param value the value to inspect.
 */
export function isPlainObject(value: unknown) {
  return isObject(value) &&
    value.constructor &&
    value.constructor === Object &&
    Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Loosely checks if value is empty.
 * 
 * @param value the value to inspect.
 */
export function isEmpty(value: unknown) {

  if (isString(value))
    return value === '';

  if (Array.isArray(value))
    return !value.length;

  if (isPlainObject(value))
    return !Object.keys(value).length;

  return false;

}

/**
 * Tries to stringify JSON.
 * 
 * @param value the value to stringify.
 */
export function tryStringifyJSON(value: Record<string, any>) {
  try {
    return JSON.stringify(value);
  }
  catch (ex) {
    return false;
  }
}

/**
 * Tries to parse JSON.
 * 
 * @param value the value to parse.
 */
export function tryParseJSON(value: string) {
  try {
    return JSON.parse(value);
  }
  catch (ex) {
    return false;
  }
}

/**
 * Merges store initial state with the persistent state.
 * 
 * @param initialState the state the store was initialized with.
 * @param persistentState the persistent state from localStorage.
 */
export function mergeStore<S extends Record<string, any>>(initialState: S, persistentState: Record<string, any>) {
  const clone = { ...initialState };
  for (const k in persistentState) {
    const value = persistentState[k];
    if (value !== null && !Array.isArray(value) && typeof value === 'object') {
      clone[k as keyof S] = mergeStore(clone[k], value);
    }
    else if(typeof value !== 'undefined') {
      clone[k as keyof S] = value;
    }
  }
  return clone;
}

/**
 * Iterates store value and filters out provided keys.
 * 
 * @param value the current store value.
 * @param strategy whether to include the filters or exclude them.
 * @param filters the values to be filtered.
 */
export function filterKeys<S extends Record<string, any>>(value: S, strategy: 'include' | 'exclude', filters: (Path<S> | string)[]) {
  if (strategy === 'exclude') {
    const clone = { ...value };
    filters.forEach(p => del(clone, p as string));
    return clone;
  }
  const result = {} as any;
  filters.forEach(p => {
    const val = get(value, p as string);
    if (typeof val !== 'undefined')
      set(result, p as string, val);
  });
  return result;
}

/**
 * Persists state to storage.
 * 
 * @param key the key used to set storage.
 * @param value the value to be set.
 * @param filters an array of keys to filter from persisted object.
 */
export function setStorage<S extends Record<string, any>>(key: string, value: S, filters: Path<S>[] = []) {
  if (typeof localStorage === 'undefined' || typeof value === 'undefined' || value === null)
    return;
  if (filters.length) {
    value = filterKeys(value, 'include', filters);
  }
  const stringified = tryStringifyJSON(value);
  if (stringified)
    localStorage.setItem(key, stringified);
}

/**
 * Gets state from storage.
 * 
 * @param key the storage key to retrieve.
 * @param filters array of keys to filter.
 */
export function getStorage<S extends Record<string, any>>(key: string, filters: Path<S>[] = []): S | Partial<S> {
  if (typeof localStorage === 'undefined')
    return null;
  const parsed = tryParseJSON(localStorage.getItem(key)) as S;
  if (!filters.length || !parsed)
    return parsed;
  return filterKeys(parsed, 'include', filters);
}

/**
 * Clears entire storage for store or clears by defined filter key.
 * 
 * @param key the storage key for the store.
 * @param filters key filters to set.
 */
export function clearStorage<S extends Record<string, any>>(key: string, filters: (Path<S> | string)[] = []) {
  if (typeof localStorage === 'undefined')
    return false;
  if (!filters.length) {
    localStorage.removeItem(key);
    return true;
  }
  const currentStore = getStorage<S>(key);
  const newStore = filterKeys(currentStore, 'exclude', filters);
  setStorage<S>(key, newStore);
  return true;
}

/**
 * Returns true if window is defined.
 */
export function isWindow() {
  return typeof window !== 'undefined';
}
