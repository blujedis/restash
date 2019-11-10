import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { ValueOf, UseStoreContext, IStoreBase, StatusBaseTypes, StatusTypes, IStoreOptions, StoreDispatch, Middleware, IStoreProvider, StatusType, MOUNTED, STATUS, KeyOf, UseThemeContext, IStore, UseStoreAtContext } from './types';
import isEqual from 'lodash.isequal';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';

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

// Used when SSR is present or seeding data on initial load of window.
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
 * Normalizes dispatch state.
 * 
 * @param keyOrState the key or state to be normalized.
 * @param value the value to normalize if present.
 */
function toState<State extends object, K extends KeyOf<State>>(keyOrState: State | K, value?: State[K]) {
  if (isUndefined(value))
    return keyOrState as State;
  return { [keyOrState as K]: value } as State;
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
export function applyMiddleware<State, Statuses extends StatusBaseTypes = StatusTypes>(
  ...middlewares: Middleware<State, Statuses>[]) {
  middlewares = middlewares.slice();
  middlewares = [thunkify(), ...middlewares, unwrap()] as any;
  middlewares.reverse();
  return (store) => {
    let dispatch = store.dispatch;
    middlewares.forEach(m => (dispatch = m(store)(dispatch)));
    return dispatch as StoreDispatch<State, Statuses>;
  };
}

/**
 * Creates a new store exposing hooks.
 * 
 * @param options options for creating the store.
 */
export function createStore<
  State extends IStoreBase<Themes> = any,
  Themes extends object = {},
  Statuses extends StatusBaseTypes = StatusTypes>(
    options: IStoreOptions<State, Themes, Statuses>) {

  let initialState = options.initialState;
  const middleware = options.middleware;
  const initialStatus = options.initialStatus || null;
  const themes = options.themes;

  validateState(initialState);

  // Break this out in case we extend at some point.
  const useStatusState = () => {
    return useState<ValueOf<Statuses>>('INIT' as any);
  };

  // Main store state.
  const useStoreState = (): UseStoreContext<State, Statuses> => {

    const mounted = useRef(false);
    const [status, setStatus] = useStatusState();
    const [state, setState] = useState<State>({} as any);

    let nextState = state;
    let nextStatus = status;

    const getState = () => state || nextState;
    const getStatus = () => status || nextStatus;

    const dispatch = (_state, _status) => {
      nextState = state;
      if (isPlainObject(_state))
        nextState = { ...state, ..._state };
      if (_status) {
        nextStatus = _status;
        setStatus(nextStatus);
      }
      setState(nextState);
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
        (middleware as Middleware<State, Statuses>)(obj)(args);
      };

    // Use effect to set initial state.
    useEffect(() => {

      const initState = getInitialState(initialState, STATE_KEY);

      if (initialStatus)
        setStatus(initialStatus as ValueOf<Statuses>);
      else
        setStatus('MOUNTED' as any);

      const _initialState = { ...(initState || {}) };
      mounted.current = true;

      setState(_initialState);

      initialState = undefined;

      return () => {
        mounted.current = false;
      };

    }, []);

    return [nextState, dispatcher as StoreDispatch<State, Statuses>, nextStatus, setStatus];

  };

  // Create the Context
  const Context = createContext<UseStoreContext<State, Statuses>>([]);

  // Set the default context display name.
  Context.displayName = 'Restash';

  // tslint:disable-next-line
  function Provider({ initialState, initialStatus, children }: IStoreProvider<State, Statuses>) {

    // tslint:disable-next-line
    let [state, setState, status, setStatus] = useStoreState();

    validateState(initialState);

    if (initialState)
      state = initialState;

    if (initialStatus)
      status = initialStatus;

    return (
      <Context.Provider value={[state, setState, status, setStatus]}>
        {children}
      </Context.Provider>
    );

  }

  function useStore<S = State>(
    key: KeyOf<S>, initValue: ValueOf<S>, initStatus?: ValueOf<Statuses>): UseStoreAtContext<S, Statuses>;
  function useStore<S = State>(initState: S, initStatus?: ValueOf<Statuses>):
    UseStoreAtContext<S, Statuses>;
  function useStore<S = State>(): UseStoreAtContext<S, Statuses>;
  function useStore<S = State>(
    initStateOrKey?: S | KeyOf<S>, initValue?: ValueOf<S> | ValueOf<Statuses>, initStatus?: ValueOf<Statuses>) {

    const [_state, setState, _status, setStatus] = useContext(Context);

    if (isPlainObject(initStateOrKey)) {
      initStatus = initValue as ValueOf<Statuses>;
      initValue = undefined;
    }

    const isNested = isString(initStateOrKey);
    const key = initStateOrKey as KeyOf<S>;
    const val = initValue as ValueOf<S>;
    const initState = (isNested ? { [key]: val } : key) as State;

    useEffect(() => {
      if (!isUndefined(initStateOrKey)) {

        setState(initState, initStatus);
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
      return [_state[key], dispatcher, _status, setStatus] as UseStoreAtContext<S, Statuses>;

    return [_state, dispatcher, _status, setStatus] as UseStoreContext<State, Statuses>;

  }

  function useTheme<K extends KeyOf<Themes>>(theme?: K) {
    const [currentTheme, setTheme] = useStore('theme', theme);
    const _theme = themes[currentTheme];
    return ([_theme, setTheme, currentTheme] as any) as UseThemeContext<Themes, K>;
  }

  const Consumer = Context.Consumer;

  const store: IStore<State, Themes, Statuses> = {
    Context,
    Provider,
    Consumer,
    useStore,
    useTheme
  };

  return store;

}
