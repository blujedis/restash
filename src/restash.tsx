
import React, { useContext, useRef, Reducer, useEffect } from 'react';
import { initContext } from './context';
import { thunkify, unwrap, isPlainObject, setStorage, getStorage, getInitialState, isUndefined, isWindow } from './utils';
import { IAction, MiddlewareDispatch, IContextOptions, Middleware, IRestashOptions, IStoreOptions, IRestashState, StatusBase, StatusBaseTypes, RestashHook, KeyOf, DispatchAt, IRestashAction, Action, DefaultStatusTypes, RestashAtHook } from './types';

const STATE_KEY = '__RESTASH_APP_STATE__';

/**
 * Applies middleware wrapping for dispatch
 * 
 * @param middlewares and array of middlewares to be applied.
 */
export function applyMiddleware(...middlewares: Middleware[]) {
  middlewares = middlewares.slice();
  middlewares = [thunkify(), ...middlewares, unwrap()] as any;
  middlewares.reverse();
  const handler: any = (store) => {
    let dispatch = store.dispatch;
    middlewares.forEach(m => (dispatch = m(store)(dispatch)));
    return dispatch as MiddlewareDispatch;
  };
  return handler as Middleware;
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
export function createContext<S extends object, A extends IAction>(
  options: IContextOptions<S, A>) {
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
export function createStore<S extends object, A extends IAction>(options?: IStoreOptions<S, A>) {

  options.reducer = options.reducer || ((s, a) => ({ ...s, ...a.payload }));

  const store = createContext<S, A>({
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
export function createRestash<
  S extends object,
  U extends string = DefaultStatusTypes>(options?: IRestashOptions<S, U>) {

  type Statuses = U | StatusBaseTypes;
  type State = IRestashState<S, Statuses>;

  // Check for persisent state
  if (options.persistent && isWindow()) {
    const state = getStorage<S>(options.persistent);
    if (state)
      options.initialState = { ...options.initialState, ...state };
  }

  // Load initial state for SSR environments.
  if (options.ssrKey && isWindow()) {
    const ssrKey = options.ssrKey === true ? STATE_KEY : options.ssrKey;
    options.initialState = getInitialState(options.initialState, ssrKey);
  }

  const reducer: Reducer<State, IRestashAction> = (s, a) => {

    let nextState = {} as any;

    nextState.status = isUndefined(a.status) || a.status === '' ? StatusBase.mounted : a.status;

    if (a.type === Action.data)
      nextState.data = { ...s.data, ...a.payload };

    nextState = { ...s, ...{ status: nextState.status }, data: { ...s.data, ...nextState.data } };

    return nextState;

  };

  const storeState: State = {
    status: StatusBase.init,
    data: options.initialState
  };

  const store = createStore<State, IRestashAction>({
    initialState: storeState,
    reducer
  });

  if (!store) return;

  const { Context, Provider, Consumer, useStore: useStoreBase } = store;

  let prevPayload = {};

  function useStore<K extends KeyOf<S>>(key: K): RestashAtHook<S[K], U, DispatchAt<S, U, K>>;
  function useStore(): RestashHook<S, U>;
  function useStore<K extends KeyOf<S>>(key?: K) {

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
      return () => mounted.current = false;
    }, []);

    const dispatch = (s, u?) => {

      let payload = s as any;

      if (key) {
        payload = { [key]: s };
        if (isPlainObject(state.data[key]) && isPlainObject(s))
          payload = { [key]: { ...state.data[key], ...s } };
      }

      // Ensures logs are accurate with latest payload reflected.
      prevPayload = payload;

      setState({
        type: Action.data,
        status: u,
        payload
      });

      const nextData = { ...state.data, ...prevPayload, ...payload };

      prevState.current = { status: u || state.status, data: nextData };

      if (options.persistent)
        setStorage(options.persistent, nextData);

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

    const withMiddleware = (...args: any) => (options.middleware)(restash)(args);
    const withoutMiddleware = (...args: any) => dispatch.apply(null, args);
    const dispatcher = (!options.middleware ? withoutMiddleware : withMiddleware);

    if (key)
      return [state.data[key] as any, dispatcher];

    return [state.data, dispatcher, restash];

  }

  return {
    Context,
    Provider,
    Consumer,
    useStore
  };

}
