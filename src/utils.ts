import { KeyOf } from "./types";

if (typeof window !== 'undefined')
  (window.setImmediate as any) = window.setImmediate || window.setTimeout;

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
  if (typeof window === 'undefined' || (window && !(window as any)[stateKey]))
    return null;
  return { ...(window as any)[stateKey] };
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
export function tryStringifyJSON(value: object) {
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
 * Persists state to storage.
 * 
 * @param key the key used to set storage.
 * @param value the value to be set.
 * @param filters an array of keys to filter from persisted object.
 */
export function setStorage<S extends object>(key: string, value: S, filters: KeyOf<S>[] = []) {
  if (typeof localStorage === 'undefined')
    return;
  setImmediate(() => {
    if (filters.length)
      value = Object.keys(value).reduce((result, k) => {
        if (filters.includes(k as KeyOf<S>))
          result[k] = value[k];
        return result;
      }, {} as S);
    const stringified = tryStringifyJSON(value);
    if (stringified)
      localStorage.setItem(key, stringified);
  });
}

/**
 * Gets state from storage.
 * 
 * @param key the storage key to retrieve.
 * @param filters array of keys to filter.
 */
export function getStorage<S extends object>(key: string, filters: KeyOf<S>[] = []) {
  if (typeof localStorage === 'undefined')
    return null;
  const parsed = tryParseJSON(localStorage.getItem(key)) as S;
  if (!filters.length || !parsed)
    return parsed;
  return Object.keys(parsed).reduce((result, k) => {
    if (filters.includes(k as KeyOf<S>))
      result[k] = parsed[k];
    return result;
  }, {} as S);
}

export function clearStorage<S extends object>(key: string, filters: KeyOf<S>[] = []) {
  if (typeof localStorage === 'undefined')
    return false;
  if (!filters.length) {
    localStorage.removeItem(key);
    return true;
  }
  setStorage<S>(key, getStorage<S>(key), filters);
  return true;
}

/**
 * Returns true if window is defined.
 */
export function isWindow() {
  return typeof window !== 'undefined';
}