"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const types_1 = require("./types");
const STATE_KEY = '__RESTASH_APP_STATE__';
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
        return null;
    return window[stateKey] || null;
}
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
/**
 * Checks if is string.
 *
 * @param value the value to inspect.
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * Checks if is of type Symbol.
 *
 * @param value the value to inspect.
 */
function isSymbol(value) {
    return typeof value === 'symbol';
}
/**
 * Checks if is undefined.
 *
 * @param value the value to inspect.
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}
/**
 * Checks if is null or undefined.
 *
 * @param value the value to inspect.
 */
function isNullOrUndefined(value) {
    return value === null || isUndefined(value);
}
/**
 * Checks if is an object.
 *
 * @param value the value to inspect.
 */
function isObject(value) {
    return !isNullOrUndefined(value) &&
        typeof value === 'object';
}
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
 * Applies middleware wrapping for dispatch
 *
 * @param middlewares and array of middlewares to be applied.
 */
function applyMiddleware(...middlewares) {
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
exports.applyMiddleware = applyMiddleware;
/**
 * Creates a new store exposing hooks.
 *
 * @param options options for creating the store.
 */
function createStore(options) {
    let initialState = options.initialState;
    const middleware = options.middleware;
    const themes = options.themes;
    validateState(initialState);
    // Main store state.
    const useStoreState = () => {
        const mounted = react_1.useRef(false);
        const [state, setState] = react_1.useState({ [types_1.STATUS]: types_1.StatusType.INIT, [types_1.MOUNTED]: false });
        let nextState = state;
        const nextStatus = nextState[types_1.STATUS];
        let prevState = nextState;
        const getState = () => nextState;
        const getStatus = () => nextState[types_1.STATUS];
        const dispatch = (_state, _status) => {
            nextState = { ...state, ...prevState, ..._state };
            if (_status)
                nextState = { ...nextState, [types_1.STATUS]: nextStatus };
            setState(nextState);
            prevState = { ..._state };
            return nextState;
        };
        const dispatcher = !middleware ?
            (...args) => dispatch.apply(null, args) :
            (...args) => {
                if (types_1.StatusType[args[1]]) {
                    args[2] = args[1];
                    args[1] = undefined;
                }
                const obj = {
                    dispatch,
                    getState,
                    getStatus,
                    get mounted() { return mounted.current; }
                };
                (middleware)(obj)(args);
            };
        const dispatchStatus = (status) => {
            dispatch({}, status);
        };
        // Use effect to set initial state.
        react_1.useEffect(() => {
            let _initialState = getInitialState(initialState, STATE_KEY);
            _initialState = { ..._initialState, [types_1.STATUS]: types_1.StatusType.MOUNTED, [types_1.MOUNTED]: true };
            mounted.current = true;
            setState(_initialState);
            initialState = undefined;
            return () => {
                mounted.current = false;
            };
        }, []);
        return [nextState, dispatcher, nextStatus, dispatchStatus, mounted];
    };
    // Create the Context
    const Context = react_1.createContext([]);
    // Set the default context display name.
    Context.displayName = 'Restash';
    // tslint:disable-next-line
    function Provider({ initialState, children }) {
        // tslint:disable-next-line
        let [state, setState, status, setStatus] = useStoreState();
        validateState(initialState);
        if (initialState)
            state = initialState;
        return (<Context.Provider value={[state, setState, status, setStatus]}>
        {children}
      </Context.Provider>);
    }
    function useStore(initStateOrKey, initValue) {
        const [_state, setState, _status, setStatus, mounted] = react_1.useContext(Context);
        const isNestedSymbol = isSymbol(initStateOrKey);
        const isNested = isString(initStateOrKey) || isNestedSymbol;
        const key = initStateOrKey;
        const val = initValue;
        const initState = (isNested ? { [key]: val } : key);
        react_1.useEffect(() => {
            if (!isUndefined(initStateOrKey)) {
                if (!isNestedSymbol) {
                    setState(initState);
                }
                else if (mounted && mounted.current) {
                    setState(initState);
                }
            }
        }, []);
        const dispatcher = (k, v, s) => {
            let nextState = k;
            if (isNested) {
                if (isUndefined(v)) {
                    nextState = { [key]: k };
                }
                else {
                    const nextNestedState = { [key]: { [k]: v } };
                    if (isPlainObject(_state[key]))
                        nextState = { ..._state[key], ...nextNestedState };
                    else
                        nextState = nextNestedState;
                }
            }
            setState(nextState, s);
        };
        if (isNested)
            return [_state[key], dispatcher, _status, setStatus, mounted];
        return [_state, dispatcher, _status, setStatus, mounted];
    }
    function useStatus(status) {
        const [currentStatus, setStatus] = useStore(types_1.STATUS, status);
        const nextStatus = (status === types_1.StatusType.INIT ? status : currentStatus || status);
        return [nextStatus, setStatus];
    }
    function useTheme(theme) {
        const [currentTheme, setTheme, status] = useStore(types_1.THEME, theme);
        const nextTheme = (status === types_1.StatusType.INIT ? theme : currentTheme || theme);
        return [themes[nextTheme], setTheme, nextTheme];
    }
    const Consumer = Context.Consumer;
    const store = {
        Context,
        Provider,
        Consumer,
        useStore,
        useStoreAt: useStore,
        useStatus,
        useTheme
    };
    return store;
}
exports.createStore = createStore;
//# sourceMappingURL=restash.jsx.map