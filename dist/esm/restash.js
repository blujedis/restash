import { useContext, useRef, useEffect } from 'react';
import { initContext } from './context';
import { get, set } from 'dot-prop';
import { thunkify, unwrap, isPlainObject, setStorage, getStorage, getInitialState, isUndefined, isWindow, clearStorage } from './utils';
import { StatusBase, Action } from './types';
const STATE_KEY = '__RESTASH_APP_STATE__';
/**
 * Applies middleware wrapping for dispatch
 *
 * @param middlewares and array of middlewares to be applied.
 */
export function applyMiddleware(...middlewares) {
    middlewares = middlewares.slice();
    middlewares = [thunkify(), ...middlewares, unwrap()];
    middlewares.reverse();
    const handler = (store) => {
        let dispatch = store.dispatch;
        middlewares.forEach(m => (dispatch = m(store)(dispatch)));
        return dispatch;
    };
    return handler;
}
/**
 * Creates a context for persisting data in your application, createContext is used by
 * both createStore and createRestash.
 *
 * @example
 * const store = createContext<S, A>({
 *   initialState: options.initialState,
 *   reducer: options.reducer
 * });
 *
 * @param options context options used to initialize.
 */
export function createContext(options) {
    return initContext(options);
}
/**
 * Creates store using default or provided reducer and dispatch action which contains
 * one property "payload" for your data.
 *
 * @example
 * import { createStore } from 'restash';
 * const { useStore } = createStore({ initialState: {} });
 * const App = () => {
 *  const [state, dispatch] = useStore();
 *  return (
 *    <pre>
 *      {JSON.stringify(state, null, 2)}
 *    </pre>
 *  );
 * };
 *
 *
 * @param options base options to initialize context.
 */
export function createStore(options) {
    options.reducer = options.reducer || ((s, a) => ({ ...s, ...a.payload }));
    const store = createContext({
        initialState: options.initialState,
        reducer: options.reducer
    });
    const { Context, Provider, Consumer } = store;
    // Hook must be wrapped.
    const useStore = () => {
        return useContext(Context);
    };
    return {
        Context,
        Provider,
        Consumer,
        useStore
    };
}
/**
 * Creates Restash store instance with simple opinionated reducer for typical persistent tasks.
 *
 * @example
 * import { createRestash } from 'restash';
 * const { useStore } = createRestash({ initialState: {}, persist: 'MyApp' });
 * const App = () => {
 *  const [state, dispatch, restash] = useStore();
 *  return (
 *    <pre>
 *      {JSON.stringify(state, null, 2)}
 *    </pre>
 *  );
 * };
 *
 *
 * @param options options used to initialize Restash.
 */
export function createRestash(options) {
    if (options.persistentKeys) {
        if (!Array.isArray(options.persistentKeys))
            options.persistentKeys = [options.persistentKeys];
        options.persistent = options.persistent || options.persistentKeys.join('-');
    }
    // Check for persisent state
    if (isWindow() && options.persistent) {
        const state = getStorage(options.persistent, options.persistentKeys);
        // If local storage state exists favor it.
        if (state) {
            options.initialState = { ...options.initialState, ...state };
        }
        // Otherwise load from window state if avail.
        else if (options.ssrKey) {
            const ssrKey = options.ssrKey === true ? STATE_KEY : options.ssrKey;
            options.initialState = getInitialState(options.initialState, ssrKey);
        }
        // Set the initial state.
        setStorage(options.persistent, options.initialState, options.persistentKeys);
    }
    // Load initial state for SSR environments.
    if (isWindow() && !options.persistent && options.ssrKey) {
        const ssrKey = options.ssrKey === true ? STATE_KEY : options.ssrKey;
        options.initialState = getInitialState(options.initialState, ssrKey);
    }
    if (typeof options.initialState !== 'object')
        options.initialState = {};
    options.initialState = options.initialState || {};
    const reducer = (s, a) => {
        const nextState = {};
        const clone = { ...s };
        nextState.status = isUndefined(a.status) || a.status === '' ? StatusBase.mounted : a.status;
        if (a.type === Action.data)
            nextState.data = { ...clone.data, ...a.payload };
        const data = { ...clone.data, ...nextState.data };
        const status = nextState.status;
        return { ...clone, status, data };
    };
    const storeState = {
        status: StatusBase.init,
        data: options.initialState
    };
    const store = createStore({
        initialState: storeState,
        reducer
    });
    if (!store)
        return;
    const { Context, Provider, Consumer, useStore: useStoreBase } = store;
    let prevPayload = {};
    /**
     * Clears persistence, when keys are present clears only those persisted keys.
     *
     * @param keys keys that should be cleared.
     */
    function clearPersistence(...keys) {
        return clearStorage(options.persistent, keys);
    }
    function useStore(key) {
        const mounted = useRef(false);
        const [state, setState] = useStoreBase();
        const prevState = useRef(state);
        useEffect(() => {
            mounted.current = true;
            if (state.status === StatusBase.init) {
                setState({
                    type: null,
                    status: StatusBase.mounted
                });
                prevState.current.status = StatusBase.mounted;
            }
            return () => {
                mounted.current = false;
            };
        }, []);
        const dispatch = (s, u) => {
            let payload = s;
            // Note when changing status alone state may be null.
            if (!key && !isPlainObject(payload) && payload !== null)
                throw new Error(`Expected typeof "object" but got ${typeof payload}`);
            if (key) {
                const segments = key.split('.');
                const parentKey = segments.slice(0, -1).join('.');
                const childKey = segments.slice(-1);
                let parent = get(state.data, parentKey);
                const current = get(state.data, key);
                // ONLY use parent if an object.
                if (!isPlainObject(parent))
                    parent = undefined;
                // Current location is not an object.
                // Check if parent is, if so use it
                // so we don't lose other keys.
                if (!isPlainObject(current)) {
                    if (parent) {
                        parent[childKey] = s;
                        payload = set({}, parentKey, parent);
                    }
                    else {
                        payload = set({}, key, s);
                    }
                }
                // Target is object.
                else {
                    // if (!isPlainObject(s))
                    //   throw new Error(`Restash detected type mismatch for path ${key}.`);
                    // deprecate above allow for setting null/undefined values.
                    if (isPlainObject(s))
                        s = { ...current, ...s };
                    payload = set({}, key, s);
                }
            }
            // Ensures logs are accurate with 
            // latest payload reflected.
            prevPayload = payload;
            setState({
                type: Action.data,
                status: u || state.status,
                payload
            });
            const nextData = { ...state.data, ...prevPayload, ...payload };
            prevState.current = { status: u || state.status, data: nextData };
            if (options.persistent)
                setStorage(options.persistent, nextData, options.persistentKeys);
            return nextData;
        };
        const restash = {
            dispatch,
            get mounted() {
                return mounted.current;
            },
            get status() {
                return prevState.current.status;
            },
            get state() {
                return prevState.current.data;
            },
            get key() {
                return key || null;
            }
        };
        const withMiddleware = (...args) => (options.middleware)(restash)(args);
        const withoutMiddleware = (...args) => dispatch(...args);
        const dispatcher = !options.middleware ? withoutMiddleware : withMiddleware;
        if (key)
            return [get(state.data, key), dispatcher];
        return [state.data, dispatcher, restash];
    }
    return {
        Context,
        Provider,
        Consumer,
        useStore,
        clearPersistence
    };
}
//# sourceMappingURL=restash.js.map