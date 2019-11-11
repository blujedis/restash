import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import {
  ValueOf, UseStoreContext, IStoreBase, StatusBaseTypes, StatusTypes, IStoreOptions, StoreDispatch, Middleware, IStoreProvider,
  StatusType, MOUNTED, STATUS, THEME, KeyOf, UseThemeContext, IStore, UseStoreAtContext, UseStatusContext, State
} from './types';
import { any } from 'prop-types';

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
  App extends object,
  Themes extends object = {},
  Statuses extends StatusBaseTypes = StatusTypes
>(...middlewares: Middleware<State<App, Themes, Statuses>, Themes, Statuses>[]) {
  middlewares = middlewares.slice();
  middlewares = [thunkify(), ...middlewares, unwrap()] as any;
  middlewares.reverse();
  const handler = (store) => {
    let dispatch = store.dispatch;
    middlewares.forEach(m => (dispatch = m(store)(dispatch)));
    return dispatch as StoreDispatch<State<App, Themes, Statuses>, Statuses>;
  };
  return handler as Middleware<State<App, Themes, Statuses>, Themes, Statuses>;
}

/**
 * Creates a new store exposing hooks.
 * 
 * @param options options for creating the store.
 */
export function createStore<
  App extends object = {},
  Themes extends object = {},
  Statuses extends StatusBaseTypes = StatusTypes>(
    options: IStoreOptions<State<App, Themes, Statuses>, Themes, Statuses>) {

  type AppState = State<App, Themes, Statuses>;

  let initialState = options.initialState;
  const middleware = options.middleware;
  const themes = options.themes;

  validateState(initialState);

  // Break this out in case we extend at some point.
  // const useStatusState = () => {
  //   return useState<ValueOf<Statuses>>('INIT' as any);
  // };

  // Main store state.
  const useStoreState = (): UseStoreContext<AppState, Statuses> => {

    const mounted = useRef(false);
    const [state, setState] = useState<AppState>({ [STATUS]: StatusType.INIT, [MOUNTED]: false } as any);

    let nextState = state;
    let nextStatus = nextState[STATUS];
    let prevState = nextState;

    const getState = () => nextState;
    const getStatus = () => nextState[STATUS];

    const dispatch = (_state, _status) => {
      nextState = { ...state, ...prevState, ..._state };
      if (_status)
        nextState = { ...nextState, [STATUS]: nextStatus }
      setState(nextState);
      prevState = { ..._state };
      return nextState;
    };

    const dispatcher = !middleware ?
      (...args: any) => dispatch.apply(null, args) :
      (...args: any) => {
        if (StatusType[args[1]]) {
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
      _initialState = { ..._initialState, [STATUS]: StatusType.MOUNTED, [MOUNTED]: true };
      mounted.current = true;
      setState(_initialState);
      initialState = undefined;

      return () => {
        mounted.current = false;
      };

    }, []);

    return [nextState, dispatcher as StoreDispatch<AppState, Statuses>, nextStatus, dispatchStatus, mounted];

  };

  // Create the Context
  const Context = createContext<UseStoreContext<AppState, Statuses>>([]);

  // Set the default context display name.
  Context.displayName = 'Restash';

  // tslint:disable-next-line
  function Provider({ initialState, children }: IStoreProvider<AppState, Statuses>) {

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

  /**
   * Expose hook to use store.
   * 
   * @param initStateOrKey the initial state or key.
   * @param initValue the initial value to bind to the key.
   */
  function useStore<S = AppState>(initStateOrKey?: S | KeyOf<S>, initValue?: ValueOf<S> | ValueOf<Statuses> | KeyOf<Themes>) {

    const [_state, setState, _status, setStatus, mounted] = useContext(Context);

    const isNestedSymbol = isSymbol(initStateOrKey);
    const isNested = isString(initStateOrKey) || isNestedSymbol;

    let key = initStateOrKey as KeyOf<S>;
    const val = initValue as ValueOf<S>;
    const initState = (isNested ? { [key]: val } : key) as State;

    useEffect(() => {
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
      return [_state[key], dispatcher, _status, setStatus, mounted] as UseStoreAtContext<S, Statuses>;

    return [_state, dispatcher, _status, setStatus, mounted] as UseStoreContext<State, Statuses>;

  }

  function useStatus<V extends ValueOf<Statuses>>(status?: V) {
    const [currentStatus, setStatus] = useStore(STATUS, status);
    const nextStatus = (status === StatusType.INIT as any ? status : currentStatus || status) as V;
    const dispatcher = s => {
      if (s === 'INIT' || s === 'MOUNTED')
        console.warn(`INIT or MOUNTED status can only be dispatched by Restash internally`);
      s = currentStatus;
      setStatus(s, null) as any;
      return s;
    }
    return ([nextStatus, setStatus] as any) as UseStatusContext<Statuses, V>;
  }

  function useTheme<K extends KeyOf<Themes>>(theme?: K) {
    const [currentTheme, setTheme, status] = useStore(THEME, theme)
    const nextTheme = (status === StatusType.INIT as any ? theme : currentTheme || theme) as K;
    return ([themes[nextTheme], setTheme, nextTheme] as any) as UseThemeContext<Themes, K>;
  }

  const Consumer = Context.Consumer;

  const store: IStore<AppState, Themes, Statuses> = {
    Context,
    Provider,
    Consumer,
    useStore,
    useStatus,
    useTheme
  };

  return store;

}
