import React, { createContext, useState, useContext, useEffect, useRef, MutableRefObject } from 'react';
import {
  ValueOf, UseStoreContext, StatusBaseTypes, StatusTypes, IStoreOptions, StoreDispatch, Middleware, IStoreProvider,
  StatusType, KeyOf, UseThemeContext, IStore, UseStoreAtContext, UseStatusContext, IStoreState, StatusBase
} from './types';

const STATE_KEY = '__RESTASH_APP_STATE__';

/**
 * Validates iniital state type.
 * 
 * @param initialState the initialState to be validated.
 */
function validateState<State = any>(initialState: State) {
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
function getInitialState<State = any>(initialState: State, stateKey: string) {
  if (initialState) return initialState;
  if (typeof window === 'undefined' || (window && !(window as any)[stateKey]))
    return null;
  return (window as any)[stateKey] || null;
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
function isString(value: unknown) {
  return typeof value === 'string';
}

/**
 * Checks if is of type Symbol.
 * 
 * @param value the value to inspect.
 */
function isSymbol(value: unknown) {
  return typeof value === 'symbol';
}

/**
 * Checks if is undefined.
 * 
 * @param value the value to inspect.
 */
function isUndefined(value: unknown) {
  return typeof value === 'undefined';
}

/**
 * Checks if is null or undefined.
 * 
 * @param value the value to inspect.
 */
function isNullOrUndefined(value: unknown) {
  return value === null || isUndefined(value);
}

/**
 * Checks if is an object.
 * 
 * @param value the value to inspect.
 */
function isObject(value: unknown) {
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
 * Applies middleware wrapping for dispatch
 * 
 * @param middlewares and array of middlewares to be applied.
 */
export function applyMiddleware<
  State extends object,
  Statuses extends StatusBaseTypes = StatusTypes
>(...middlewares: Middleware<State, Statuses>[]) {
  middlewares = middlewares.slice();
  middlewares = [thunkify(), ...middlewares, unwrap()] as any;
  middlewares.reverse();
  const handler: any = (store) => {
    let dispatch = store.dispatch;
    middlewares.forEach(m => (dispatch = m(store)(dispatch)));
    return dispatch as StoreDispatch<State, Statuses>;
  };
  return handler as Middleware<State, Statuses>;
}

/**
 * Creates a new store exposing hooks.
 * 
 * @param options options for creating the store.
 */
export function createStore<
  State extends object,
  Themes extends object = {},
  Statuses extends StatusBaseTypes = StatusTypes>(
    options: IStoreOptions<State, Themes, Statuses>) {

  type SS = IStoreState<State, Themes, Statuses>;

  let initialState = options.initialState;
  const middleware = options.middleware;
  const themes = options.themes || {};
  const statuses = isUndefined(options.statuses) ? StatusType : { ...options.statuses, ...StatusBase };

  validateState(initialState);

  // Main store state.
  const useStoreState = (): UseStoreContext<State, Statuses> => {

    const mounted = useRef(false);
    const [state, setState] = useState<IStoreState<State, Themes, Statuses>>({ status: StatusType.INIT, mounted: false } as any);

    let nextState = state;
    let prevState = nextState;

    const getState = () => nextState;
    const getStatus = () => nextState.status;

    const dispatch = (_state, _status) => {
      if (isUndefined(_state) && isUndefined(_status))
        return _state;
      nextState = { ...state, ...prevState, ..._state };
      if (_status)
        nextState = { ...nextState, status: nextState.status };
      setState(nextState);
      prevState = { ..._state };
      return nextState;
    };

    const dispatcher = !middleware ?
      (...args: any) => dispatch.apply(null, args) :
      (...args: any) => {
        if (statuses[args[1]]) {
          args[2] = args[1];
          args[1] = undefined;
        }
        const obj = {
          dispatch,
          getState,
          getStatus,
          get mounted() { return mounted.current; }
        };
        (middleware)(obj as any)(args);
      };

    const dispatchStatus = (status) => {
      dispatch({}, status);
    };

    // Use effect to set initial state.
    useEffect(() => {

      let _initialState = getInitialState(initialState, STATE_KEY);
      _initialState = { ..._initialState, status: StatusType.MOUNTED, mounted: true };

      mounted.current = true;

      setState(_initialState);

      initialState = undefined;

      return () => {
        mounted.current = false;
      };

    }, []);

    return [nextState, dispatcher as StoreDispatch<State, Statuses>, nextStatus, dispatchStatus, mounted];

  };

  // Create the Context
  const Context = createContext<UseStoreContext<State, Statuses>>([]);

  // Set the default context display name.
  Context.displayName = 'Restash';

  // tslint:disable-next-line
  function Provider({ initialState, children }: IStoreProvider<State>) {

    // tslint:disable-next-line
    let [state, setState, status, setStatus] = useStoreState();

    validateState(initialState);

    if (initialState)
      state = initialState;

    return (
      <Context.Provider value={[state, setState, status, setStatus]}>
        {children}
      </Context.Provider>
    );

  }

  let _initialized_hooks = false;

  const shouldInit = (ref, obj) => {
    if (isPlainObject(obj) && !Object.keys(obj).length)
      return false;
    if (!_initialized_hooks && !ref.current.has(obj))
      return true;
    else if (_initialized_hooks && !ref.current.has(obj))
      return true;
    return false;
  };

  /**
   * Initializes the store.
   * 
   * @param initStateOrKey the initialization key or value.
   * @param initValue the correspondeing value for key.
   */
  function useStoreInit(initStateOrKey?: State | KeyOf<State>, initValue?: ValueOf<State> | ValueOf<Statuses> | KeyOf<Themes>) {

    const [_state, setState, _status, setStatus, mounted] = useContext(Context);
    const inits = useRef(new Set());

    const isNested = isString(initStateOrKey) || isSymbol(initStateOrKey);
    const initState = (isNested ? { [initStateOrKey as any]: initValue } : initStateOrKey || {}) as State;
    const key = (isNested ? initStateOrKey : undefined) as any;

    useEffect(() => {
      if (shouldInit(inits, initStateOrKey)) {
        setState(initState);
        inits.current.add(initState);
      }
      _initialized_hooks = true;
    }, []);

    const dispatcher = (k, v, s) => {

      let tmpState = k;

      if (isNested) {
        if (isUndefined(v)) {
          tmpState = { [key]: k };
        }
        else {
          const nextTmpState = { [key]: { [k]: v } };
          if (isPlainObject(_state[key]))
            tmpState = { ..._state[key], ...nextTmpState };
          else
            tmpState = nextTmpState;
        }
      }

      setState(tmpState, s);

      return tmpState;

    };

    if (isNested)
      return [_state[key], dispatcher, _status, setStatus, mounted, inits] as UseStoreAtContext<State, Statuses>;

    return [_state, dispatcher, _status, setStatus, mounted, inits] as UseStoreContext<State, Statuses>;

  }

  /**
   * Expose hook to use store at key.
   * 
   * @param key the initial state or key.
   * @param initialValue the initial value to bind to the key.
   */
  function useStore(key: KeyOf<State>, initialValue?: ValueOf<State> | ValueOf<Statuses> | KeyOf<Themes>): UseStoreAtContext<State, Statuses>;

  /**
   * Expose hook to use store.
   * 
   * @param initialState the initial state.
   */
  function useStore(initialState?: State): UseStoreContext<State, Statuses>;

  function useStore(initStateOrKey?, initValue?) {

    const obj = isString(initStateOrKey) || isSymbol(initStateOrKey) ? { [initStateOrKey]: initValue } : initStateOrKey;

    const [state, setState, status, setStatus, mounted, inits] =
      useStoreInit(initStateOrKey, initValue);

    let nextState = state;

    if (initStateOrKey && !_initialized_hooks)
      nextState = { ...state, ...obj };

    return ([nextState, setState, status, setStatus]) as any;

  }

  function useStatus<K extends KeyOf<Statuses>>(status?: Statuses[K]) {
    const [currentStatus, setStatus] = useStoreInit('status', status) as any;
    const nextStatus = !_initialized_hooks ? status || currentStatus : currentStatus || status;
    return ([nextStatus, setStatus]) as UseStatusContext<Statuses, Statuses[K]>;
  }

  function useTheme<K extends KeyOf<Themes>>(theme?: K) {
    const [currentTheme, setTheme] = useStoreInit('theme', theme) as any;
    const nextTheme = !_initialized_hooks ? theme || currentTheme : currentTheme || theme;
    return ([themes[nextTheme], setTheme, nextTheme]) as UseThemeContext<Themes, K>;
  }

  const Consumer = Context.Consumer;

  const store: IStore<State, Themes, Statuses> = {
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
