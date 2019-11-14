"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const context_1 = require("./context");
const utils_1 = require("./utils");
const types_1 = require("./types");
const util_1 = require("util");
const contexts = new Set();
/**
 * Gets a unique key based on number of loaded contexts.
 *
 * @param key the store key.
 */
function getKey(key = 'RESTASH_STORE') {
    const len = [...contexts.values()].filter(v => v === key).length;
    return key + '_' + len;
}
exports.getKey = getKey;
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
function createContext(name, options) {
    if (contexts.has(name))
        return null;
    contexts.add(name);
    return context_1.initContext(options);
}
exports.createContext = createContext;
/**
 * Creates a simple persistent store.
 *
 * @param initialState the initial state of the store.
 */
function createStore(options) {
    options.reducer = options.reducer || ((s, a) => ({ ...s, ...a.payload }));
    const key = getKey();
    const store = createContext(key, {
        initialState: options.initialState,
        reducer: options.reducer
    });
    if (!store)
        return;
    const { Context, Provider, Consumer } = store;
    // Hook must be wrapped.
    const useStore = () => {
        const [state, dispatch] = react_1.useContext(Context);
        return [state, dispatch];
    };
    return {
        Context,
        Provider,
        Consumer,
        useStore
    };
}
exports.createStore = createStore;
function createRestash(options) {
    // Check for persisent state
    if (options.persist) {
        const state = utils_1.getStorage(options.persist);
        if (state)
            options.initialState = { ...options.initialState, ...state };
    }
    const reducer = (s, a) => {
        if (util_1.isUndefined(a))
            return s;
        let nextState = s;
        if (a.type === types_1.Action.data)
            nextState = { ...s, ...{ data: { ...s.data, ...a.payload } } };
        if (a.type === types_1.Action.status)
            nextState = { ...s, ...{ [types_1.Action.status]: a.payload } };
        return nextState;
    };
    const storeState = {
        status: types_1.Status.init,
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
    function useStore(key) {
        const mounted = react_1.useRef(false);
        const [state, setState] = useStoreBase();
        react_1.useEffect(() => {
            mounted.current = true;
            if (state.status !== types_1.Status.mounted)
                setState({
                    type: types_1.Action.status,
                    payload: types_1.Status.mounted
                });
            return () => mounted.current = false;
        }, []);
        const dispatch = (s, u) => {
            let payload = s;
            if (key) {
                payload = { [key]: s };
                if (utils_1.isPlainObject(state.data[key]) && utils_1.isPlainObject(s))
                    payload = { [key]: { ...state.data[key], ...s } };
            }
            // Ensures logs are accurate with latest payload reflected.
            prevPayload = payload;
            setState({
                type: types_1.Action.data,
                payload
            });
            const nextState = { ...state.data, ...prevPayload, ...payload };
            if (options.persist)
                utils_1.setStorage(options.persist, nextState);
            return nextState;
        };
        const restash = {
            dispatch,
            get mounted() {
                return mounted.current;
            },
            get status() {
                return state.status;
            },
            get state() {
                return state.data;
            },
            get key() {
                return key || null;
            }
        };
        const withMiddleware = (...args) => (options.middleware)(restash)(args);
        const withoutMiddleware = (...args) => dispatch.apply(null, args);
        const dispatcher = (!options.middleware ? withoutMiddleware : withMiddleware);
        if (key)
            return [state.data[key], dispatcher, restash];
        return [state.data, dispatcher, restash];
    }
    return {
        Context,
        Provider,
        Consumer,
        useStore
    };
}
exports.createRestash = createRestash;
//# sourceMappingURL=restash.jsx.map