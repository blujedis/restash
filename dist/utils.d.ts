/**
 * Validates iniital state type.
 *
 * @param initialState the initialState to be validated.
 */
export declare function validateState<S = any>(initialState: S): void;
/**
 * Gets the initialiState by passed in value or value from window if using SSR.
 *
 * @param initialState the initial state passed in manually.
 * @param stateKey the key on the window to use if avail (ssr ONLY).
 */
export declare function getInitialState<S = any>(initialState: S, stateKey: string): any;
/**
 * Internal function to thunkify middleware.
 */
export declare function thunkify(): (store: any) => (next: any) => (payload: any) => any;
/**
 * Middleware to unwrap payload to match raw dispatch signature.
 */
export declare function unwrap(): (store: any) => (next: any) => (payload: any) => any;
/**
 * Checks if is string.
 *
 * @param value the value to inspect.
 */
export declare function isString(value: unknown): boolean;
/**
 * Checks if is of type Symbol.
 *
 * @param value the value to inspect.
 */
export declare function isSymbol(value: unknown): boolean;
/**
 * Checks if is undefined.
 *
 * @param value the value to inspect.
 */
export declare function isUndefined(value: unknown): boolean;
/**
 * Checks if is null or undefined.
 *
 * @param value the value to inspect.
 */
export declare function isNullOrUndefined(value: unknown): boolean;
/**
 * Checks if is function
 *
 * @param value the value to inspect.
 */
export declare function isFunction(value: unknown): boolean;
/**
 * Checks if is an object.
 *
 * @param value the value to inspect.
 */
export declare function isObject(value: unknown): boolean;
/**
 * Checks if is a plain object.
 *
 * @param value the value to inspect.
 */
export declare function isPlainObject(value: unknown): boolean;
/**
 * Loosely checks if value is empty.
 *
 * @param value the value to inspect.
 */
export declare function isEmpty(value: unknown): boolean;
/**
 * Tries to stringify JSON.
 *
 * @param value the value to stringify.
 */
export declare function tryStringifyJSON(value: object): string | false;
/**
 * Tries to parse JSON.
 *
 * @param value the value to parse.
 */
export declare function tryParseJSON(value: string): any;
/**
 * Persists state to storage.
 *
 * @param key the key used to set storage.
 * @param value the value to be set.
 */
export declare function setStorage(key: string, value: object): void;
/**
 * Gets state from storage.
 *
 * @param key the storage key to retrieve.
 */
export declare function getStorage<S extends object>(key: string): S;
