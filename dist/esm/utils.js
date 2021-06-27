/**
 * Validates iniital state type.
 *
 * @param initialState the initialState to be validated.
 */
export function validateState(initialState) {
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
export function getInitialState(initialState, stateKey) {
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
export function isString(value) {
    return typeof value === 'string';
}
/**
 * Checks if is of type Symbol.
 *
 * @param value the value to inspect.
 */
export function isSymbol(value) {
    return typeof value === 'symbol';
}
/**
 * Checks if is undefined.
 *
 * @param value the value to inspect.
 */
export function isUndefined(value) {
    return typeof value === 'undefined';
}
/**
 * Checks if is null or undefined.
 *
 * @param value the value to inspect.
 */
export function isNullOrUndefined(value) {
    return value === null || isUndefined(value);
}
/**
 * Checks if is function
 *
 * @param value the value to inspect.
 */
export function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Checks if is an object.
 *
 * @param value the value to inspect.
 */
export function isObject(value) {
    return !isNullOrUndefined(value) &&
        typeof value === 'object';
}
/**
 * Checks if is a plain object.
 *
 * @param value the value to inspect.
 */
export function isPlainObject(value) {
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
export function isEmpty(value) {
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
export function tryStringifyJSON(value) {
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
export function tryParseJSON(value) {
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
export function setStorage(key, value, filters = []) {
    if (typeof localStorage === 'undefined')
        return;
    setTimeout(() => {
        if (filters.length)
            value = Object.keys(value).reduce((result, k) => {
                if (filters.includes(k))
                    result[k] = value[k];
                return result;
            }, {});
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
export function getStorage(key, filters = []) {
    if (typeof localStorage === 'undefined')
        return null;
    const parsed = tryParseJSON(localStorage.getItem(key));
    if (!filters.length || !parsed)
        return parsed;
    return Object.keys(parsed).reduce((result, k) => {
        if (filters.includes(k))
            result[k] = parsed[k];
        return result;
    }, {});
}
/**
 * Clears entire storage for store or clears by defined filter key.
 *
 * @param key the storage key for the store.
 * @param filters key filters to set.
 */
export function clearStorage(key, filters = []) {
    if (typeof localStorage === 'undefined')
        return false;
    if (!filters.length) {
        localStorage.removeItem(key);
        return true;
    }
    setStorage(key, getStorage(key), filters);
    return true;
}
/**
 * Returns true if window is defined.
 */
export function isWindow() {
    return typeof window !== 'undefined';
}
//# sourceMappingURL=utils.js.map