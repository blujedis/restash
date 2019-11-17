"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validates iniital state type.
 *
 * @param initialState the initialState to be validated.
 */
function validateState(initialState) {
    if (initialState && (typeof initialState !== 'object' || Array.isArray(initialState) || initialState === null)) {
        const type = initialState === null ? 'null' : Array.isArray(initialState) ? 'Array' : typeof initialState;
        throw new Error(`Restash initialState must be of type object but got ${type}`);
    }
}
exports.validateState = validateState;
/**
 * Gets the initialiState by passed in value or value from window if using SSR.
 *
 * @param initialState the initial state passed in manually.
 * @param stateKey the key on the window to use if avail (ssr ONLY).
 */
function getInitialState(initialState, stateKey) {
    if (initialState)
        return initialState;
    if (typeof window === 'undefined' || (window && !window[stateKey]))
        return {};
    return window[stateKey] || {};
}
exports.getInitialState = getInitialState;
/**
 * Internal function to thunkify middleware.
 */
function thunkify() {
    return store => next => payload => {
        const [state] = payload;
        if (typeof state === 'function') {
            const { dispatch, getState } = store;
            return state(dispatch, getState);
        }
        return next(payload);
    };
}
exports.thunkify = thunkify;
/**
 * Middleware to unwrap payload to match raw dispatch signature.
 */
function unwrap() {
    return store => next => payload => {
        const [state] = payload;
        if (typeof state === 'function') {
            const { dispatch, getState } = store;
            return state(dispatch, getState);
        }
        return next(...payload);
    };
}
exports.unwrap = unwrap;
/**
 * Checks if is string.
 *
 * @param value the value to inspect.
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
/**
 * Checks if is of type Symbol.
 *
 * @param value the value to inspect.
 */
function isSymbol(value) {
    return typeof value === 'symbol';
}
exports.isSymbol = isSymbol;
/**
 * Checks if is undefined.
 *
 * @param value the value to inspect.
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}
exports.isUndefined = isUndefined;
/**
 * Checks if is null or undefined.
 *
 * @param value the value to inspect.
 */
function isNullOrUndefined(value) {
    return value === null || isUndefined(value);
}
exports.isNullOrUndefined = isNullOrUndefined;
/**
 * Checks if is function
 *
 * @param value the value to inspect.
 */
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
/**
 * Checks if is an object.
 *
 * @param value the value to inspect.
 */
function isObject(value) {
    return !isNullOrUndefined(value) &&
        typeof value === 'object';
}
exports.isObject = isObject;
/**
 * Checks if is a plain object.
 *
 * @param value the value to inspect.
 */
function isPlainObject(value) {
    return isObject(value) &&
        value.constructor &&
        value.constructor === Object &&
        Object.prototype.toString.call(value) === '[object Object]';
}
exports.isPlainObject = isPlainObject;
/**
 * Loosely checks if value is empty.
 *
 * @param value the value to inspect.
 */
function isEmpty(value) {
    if (isString(value))
        return value === '';
    if (Array.isArray(value))
        return !value.length;
    if (isPlainObject(value))
        return !Object.keys(value).length;
    return false;
}
exports.isEmpty = isEmpty;
/**
 * Tries to stringify JSON.
 *
 * @param value the value to stringify.
 */
function tryStringifyJSON(value) {
    try {
        return JSON.stringify(value);
    }
    catch (ex) {
        return false;
    }
}
exports.tryStringifyJSON = tryStringifyJSON;
/**
 * Tries to parse JSON.
 *
 * @param value the value to parse.
 */
function tryParseJSON(value) {
    try {
        return JSON.parse(value);
    }
    catch (ex) {
        return false;
    }
}
exports.tryParseJSON = tryParseJSON;
/**
 * Persists state to storage.
 *
 * @param key the key used to set storage.
 * @param value the value to be set.
 */
function setStorage(key, value) {
    if (typeof localStorage === 'undefined')
        return;
    setImmediate(() => {
        const stringified = tryStringifyJSON(value);
        if (stringified)
            localStorage.setItem(key, stringified);
    });
}
exports.setStorage = setStorage;
/**
 * Gets state from storage.
 *
 * @param key the storage key to retrieve.
 */
function getStorage(key) {
    if (typeof localStorage === 'undefined')
        return null;
    return tryParseJSON(localStorage.getItem(key));
}
exports.getStorage = getStorage;
//# sourceMappingURL=utils.js.map