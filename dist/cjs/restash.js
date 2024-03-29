"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestash = exports.createStore = exports.createContext = exports.applyMiddleware = void 0;
const react_1 = require("react");
const context_1 = require("./context");
const dot_prop_1 = require("dot-prop");
const utils_1 = require("./utils");
const types_1 = require("./types");
const STATE_KEY = '__RESTASH_APP_STATE__';
/**
 * Applies middleware wrapping for dispatch
 *
 * @param middlewares and array of middlewares to be applied.
 */
function applyMiddleware(...middlewares) {
    middlewares = middlewares.slice();
    middlewares = [utils_1.thunkify(), ...middlewares, utils_1.unwrap()];
    middlewares.reverse();
    const handler = (store) => {
        let dispatch = store.dispatch;
        middlewares.forEach(m => (dispatch = m(store)(dispatch)));
        return dispatch;
    };
    return handler;
}
exports.applyMiddleware = applyMiddleware;
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
function createContext(options) {
    return context_1.initContext(options);
}
exports.createContext = createContext;
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
function createStore(options) {
    options.reducer = options.reducer || ((s, a) => ({ ...s, ...a.payload }));
    const store = createContext({
        initialState: options.initialState,
        reducer: options.reducer
    });
    const { Context, Provider, Consumer } = store;
    // Hook must be wrapped.
    const useStore = () => {
        return react_1.useContext(Context);
    };
    return {
        Context,
        Provider,
        Consumer,
        useStore
    };
}
exports.createStore = createStore;
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
function createRestash(options) {
    if (typeof options.persistentKeys !== 'undefined') {
        if (!Array.isArray(options.persistentKeys))
            options.persistentKeys = [options.persistentKeys];
        // use persistent key or make one from keys
        // should this be changed to a generated uid or somethign?
        options.persistent = options.persistent || options.persistentKeys.join('-');
    }
    // Check for persisent state
    if (utils_1.isWindow() && options.persistent) {
        const state = utils_1.getStorage(options.persistent, options.persistentKeys);
        // If local storage state exists favor it.
        if (state) {
            options.initialState = utils_1.mergeStore(options.initialState, state);
        }
        // Otherwise load from window state if avail.
        else if (options.ssrKey) {
            const ssrKey = options.ssrKey === true ? STATE_KEY : options.ssrKey;
            options.initialState = utils_1.getInitialState(options.initialState, ssrKey);
        }
        // Set the initial persistent state.
        utils_1.setStorage(options.persistent, options.initialState, options.persistentKeys);
    }
    // Load initial state for SSR environments.
    if (utils_1.isWindow() && !options.persistent && options.ssrKey) {
        const ssrKey = options.ssrKey === true ? STATE_KEY : options.ssrKey;
        options.initialState = utils_1.getInitialState(options.initialState, ssrKey);
    }
    if (typeof options.initialState !== 'object')
        options.initialState = {};
    options.initialState = options.initialState || {};
    const reducer = (s, a) => {
        const nextState = {};
        const clone = { ...s };
        nextState.status = utils_1.isUndefined(a.status) || a.status === '' ? types_1.StatusBase.mounted : a.status;
        if (a.type === types_1.Action.data)
            nextState.data = { ...clone.data, ...a.payload };
        const data = { ...clone.data, ...nextState.data };
        const status = nextState.status;
        return { ...clone, status, data };
    };
    const storeState = {
        status: types_1.StatusBase.init,
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
    function clearPersistence(...keys) {
        return utils_1.clearStorage(options.persistent, keys);
    }
    function useStore(key, val) {
        const mounted = react_1.useRef(false);
        const [state, setState] = useStoreBase();
        const prevState = react_1.useRef(state);
        react_1.useEffect(() => {
            mounted.current = true;
            if (state.status === types_1.StatusBase.init) {
                const obj = {
                    type: null,
                    status: types_1.StatusBase.mounted
                };
                if (typeof val !== 'undefined')
                    obj.data = dot_prop_1.set({ ...state }, key, val);
                setState(obj);
                prevState.current.status = types_1.StatusBase.mounted;
            }
            return () => {
                mounted.current = false;
            };
        }, []);
        const dispatch = (s, u) => {
            let payload = s;
            // Note when changing status alone state may be null.
            if (!key && !utils_1.isPlainObject(payload) && payload !== null)
                throw new Error(`Expected typeof "object" but got ${typeof payload}`);
            if (key) {
                const segments = key.split('.');
                const parentKey = segments.slice(0, -1).join('.');
                const childKey = segments.slice(-1);
                let parent = dot_prop_1.get(state.data, parentKey);
                const current = dot_prop_1.get(state.data, key);
                // ONLY use parent if an object.
                if (!utils_1.isPlainObject(parent))
                    parent = undefined;
                // Current location is not an object.
                // Check if parent is, if so use it
                // so we don't lose other keys.
                if (!utils_1.isPlainObject(current)) {
                    if (parent) {
                        parent[childKey] = s;
                        payload = dot_prop_1.set({}, parentKey, parent);
                    }
                    else {
                        payload = dot_prop_1.set({}, key, s);
                    }
                }
                // Target is object.
                else {
                    // if (!isPlainObject(s))
                    //   throw new Error(`Restash detected type mismatch for path ${key}.`);
                    // deprecate above allow for setting null/undefined values.
                    if (utils_1.isPlainObject(s))
                        s = { ...current, ...s };
                    payload = dot_prop_1.set({}, key, s);
                }
            }
            // Ensures logs are accurate with 
            // latest payload reflected.
            prevPayload = payload;
            setState({
                type: types_1.Action.data,
                status: u || state.status,
                payload
            });
            const nextData = { ...state.data, ...prevPayload, ...payload };
            prevState.current = { status: u || state.status, data: nextData };
            if (options.persistent) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                utils_1.setStorage(options.persistent, nextData, options.persistentKeys);
            }
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
            return [dot_prop_1.get(state.data, key), dispatcher, restash];
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
exports.createRestash = createRestash;
//# sourceMappingURL=restash.js.map