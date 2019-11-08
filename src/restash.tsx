import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { ValueOf, UseStoreContext, IStoreBase, StatusBaseTypes, StatusTypes, IStoreOptions, IStoreDispatch, Middleware, IStoreProvider, StatusType, DYNAMIC, KeyOf, UseThemeContext, IStore } from './types';

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
    return dispatch as IStoreDispatch<State, Statuses>;
  };
}

/**
 * Creates a new store exposing hooks.
 * 
 * @param options options for creating the store.
 */
export function createStore<State extends IStoreBase = any,
  Themes extends object = {}, Statuses extends StatusBaseTypes = StatusTypes>(
    options: IStoreOptions<State, Themes, Statuses>) {

  let initialState = options.initialState;
  const middleware = options.middleware;
  const initialStatus = options.initialStatus || null;
  const stateKey = options.stateKey || '__APP_STATE__';
  const themes = options.themes;
  const themeKey = options.themeKey || 'theme';

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

    let newState;
    let newStatus;
    const getState = () => newState || state;
    const getStatus = () => newStatus || status;

    // Custom State dispatcher.
    function dispatch(key: any, value: any, _status?: ValueOf<Statuses>) {

      if (StatusType[value]) {
        _status = value;
        value = undefined;
      }

      if (typeof value === 'undefined' && typeof key !== 'string') {
        newState = { ...state, ...key };
      }
      else {
        if (typeof state[key] === 'object' && !Array.isArray(state[key]))
          newState = { ...state, ...{ [key]: value } };
        else
          newState = { ...state, [key]: value };
      }

      setState(newState);

      if (_status) {
        newStatus = _status;
        setStatus(_status);
      }

      return newState as any;

    }

    const dispatcher = !middleware ?
      (...args: any) => dispatch.apply(null, args) :
      (...args: any) => {
        if (StatusType[args[1]]) {
          args[2] = args[1];
          args[1] = undefined;
        }
        const _dispatch = dispatch as IStoreDispatch<State, Statuses>;
        const obj = {
          dispatch: _dispatch,
          getState,
          getStatus,
          get mounted() { return mounted.current; }
        };
        (middleware as Middleware<State, Statuses>)(obj)(args);
      };

    // Use effect to set initial state.
    useEffect(() => {
      const initState = getInitialState(initialState, stateKey);
      if (initialStatus)
        setStatus(initialStatus as ValueOf<Statuses>);
      else
        setStatus('MOUNTED' as any);
      const _initialState = { ...(initState || {}), [DYNAMIC]: {} };
      setState(_initialState);
      initialState = undefined;
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, []);

    return [state, dispatcher as IStoreDispatch<State, Statuses>, status, setStatus];

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

  function useStore<K extends keyof State>(
    initState?: Partial<State> | K, initValue?: Partial<State>[K] | ValueOf<Statuses>, initStatus?: ValueOf<Statuses>) {

    const [_state, setState, _status, setStatus] = useContext(Context);

    if (typeof initState === 'object') {
      initStatus = initValue as ValueOf<Statuses>;
      initValue = undefined;
    }

    useEffect(() => {
      if (typeof initState !== 'undefined')
        setState(initState as any, initValue as any, initStatus);
    }, []);

    return [_state, setState, _status, setStatus] as UseStoreContext<State, Statuses>;

  }

  function useStoreAt<K extends keyof State>(key: K, initState?: State[K], initStatus?: ValueOf<Statuses>) {

    const [state, setState, _status, setStatus] = useStore(key, initState, initStatus);

    const dispatcher = (k: any, v: any, s: ValueOf<Statuses>) => {

      // Only setting status.
      if (StatusType[v]) {
        s = v;
        v = undefined;
      }

      const currentValue = state[key];

      // Updating value directly at key.
      if (typeof v === 'undefined') {
        if (typeof k === 'object' && !Array.isArray(k) && k !== null)
          v = { ...currentValue, ...k };
        else
          v = { ...currentValue, [key]: k };
      }
      // Updating nested value at key.
      else {
        if (typeof currentValue !== 'undefined' && (currentValue === null
          || (typeof currentValue !== 'object' && !Array.isArray(currentValue))))
          throw new Error(`Failed to set store value at "${key}", the destination is not an object.`);
        v = { ...currentValue, [k]: v };
      }

      setState(key, v, s);

    };

    return [state[key], dispatcher as IStoreDispatch<State, Statuses>,
      _status, setStatus] as UseStoreContext<State[K], Statuses>;

  }

  function useTheme<K extends KeyOf<Themes>>(theme?: K) {
    const [currentTheme, setTheme] = useStoreAt(themeKey);
    const _theme = themes[theme || currentTheme];
    return [_theme, currentTheme || theme, setTheme] as UseThemeContext<Themes, K>;
  }

  function useAny<DynamicState, K extends KeyOf<State>>(
    key: K | Partial<DynamicState>, initState?: Partial<DynamicState>) {
    if (arguments.length === 1) {
      initState = key as Partial<DynamicState>;
      key = DYNAMIC as K;
    }
    return useStoreAt(DYNAMIC as K, initState as any) as UseStoreContext<DynamicState, Statuses>;
  }

  const Consumer = Context.Consumer;

  const store: IStore<State, Themes, Statuses> = {
    Context,
    Provider,
    Consumer,
    useStore,
    useStoreAt,
    useTheme,
    useAny
  };

  return store;

}
