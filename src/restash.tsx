
import { useContext, useRef, Reducer, useEffect } from 'react';
import { initContext } from './context';
import { thunkify, unwrap, isPlainObject, setStorage, getStorage } from './utils';
import { IAction, MiddlewareDispatch, IContextOptions, Middleware, IRestashOptions, IStoreOptions, IStoreState, StatusBase, StatusBaseTypes, RestashHook, KeyOf, DispatchAt, IRestashAction, Action } from './types';
import { isUndefined } from 'util';

const STATE_KEY = '__RESTASH_APP_STATE__';
const contexts = new Set<string>();

/**
 * Gets a unique key based on number of loaded contexts.
 * 
 * @param key the store key.
 */
export function getKey(key: string = 'RESTASH_STORE') {
  const len = [...contexts.values()].filter(v => v === key).length;
  return key + '_' + len;
}

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
 * const store = createContext<S, A>(unique_key, {
 *   initialState: options.initialState,
 *   reducer: options.reducer
 * });
 * 
 * @param name the name of the context to be created.
 * @param options context options used to initialize.
 */
export function createContext<S extends object, A extends IAction>(
  name: string,
  options: IContextOptions<S, A>) {
  if (contexts.has(name)) return null;
  contexts.add(name);
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

  const key = getKey();

  const store = createContext<S, A>(key, {
    initialState: options.initialState,
    reducer: options.reducer
  });

  if (!store) return;

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
  U extends string>(options?: IRestashOptions<S, U>) {

  type Statuses = U | StatusBaseTypes;
  type State = IStoreState<S, Statuses>;

  // Check for persisent state
  if (options.persistent) {
    const state = getStorage<S>(options.persistent);
    if (state)
      options.initialState = { ...options.initialState, ...state };
  }

  const reducer: Reducer<State, IRestashAction> = (s, a) => {

    if (isUndefined(a))
      return s;

    let nextState = s;

    if (a.type === Action.data)
      nextState = { ...s, ...{ data: { ...s.data, ...a.payload } } };


    if (a.type === Action.status)
      nextState = { ...s, ...{ [Action.status]: a.payload } };

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

  function useStore<K extends KeyOf<S>>(key: K): RestashHook<S[K], U, DispatchAt<S, U, K>>;
  function useStore(): RestashHook<S, U>;
  function useStore<K extends KeyOf<S>>(key?: K) {

    const mounted = useRef(false);
    const [state, setState] = useStoreBase();

    useEffect(() => {
      mounted.current = true;
      if (state.status !== StatusBase.mounted)
        setState({
          type: Action.status,
          payload: StatusBase.mounted
        });
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
        payload
      });

      const nextState = { ...state.data, ...prevPayload, ...payload };

      if (options.persistent)
        setStorage(options.persistent, nextState);

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

    const withMiddleware = (...args: any) => (options.middleware)(restash)(args);
    const withoutMiddleware = (...args: any) => dispatch.apply(null, args);
    const dispatcher = (!options.middleware ? withoutMiddleware : withMiddleware);

    if (key)
      return [state.data[key] as any, dispatcher, restash];

    return [state.data, dispatcher, restash];

  }

  return {
    Context,
    Provider,
    Consumer,
    useStore
  };

}

