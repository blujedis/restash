
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
  if (initialState) return initialState;
  if (typeof window === 'undefined' || (window && !(window as any)[stateKey]))
    return null;
  return (window as any)[stateKey] || null;
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
 */
export function setStorage(key: string, value: object) {
  if (typeof localStorage === 'undefined')
    return;
  setImmediate(() => {
    const stringified = tryStringifyJSON(value);
    if (stringified)
      localStorage.setItem(key, stringified);
  });
}

/**
 * Gets state from storage.
 * 
 * @param key the storage key to retrieve.
 */
export function getStorage<S extends object>(key: string) {
  if (typeof localStorage === 'undefined')
    return null;
  return tryParseJSON(localStorage.getItem(key)) as S;
}