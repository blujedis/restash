
import { useContext, useRef, Reducer } from 'react';
import { initContext } from './context';
import { toMerged, thunkify, unwrap } from './utils';
import { IRestashDispatch, IAction, Dispatcher, IContextOptions, Middleware, IStoreOptions, IStoreBaseOptions, IStoreState } from './types';

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
// function applyMiddleware(...middlewares: Middleware<S, U>[]) {
//   middlewares = middlewares.slice();
//   middlewares = [thunkify(), ...middlewares, unwrap()] as any;
//   middlewares.reverse();
//   const handler: any = (store) => {
//     let dispatch = store.dispatch;
//     middlewares.forEach(m => (dispatch = m(store)(dispatch)));
//     return dispatch as Dispatch<S, U>;
//   };
//   return handler as Middleware<S, U>;
// }

export function createContext<S extends object, A extends IAction = any>(
  name: string,
  options: IContextOptions<S, A>) {
  if (contexts.has(name)) return null;
  contexts.add(name);
  return initContext(options);
}

/**
 * Creates a simple persistent store.
 * 
 * @param initialState the initial state of the store.
 */
export function createStore<S extends object, A extends IAction>(options?: IStoreBaseOptions<S>) {

  options.reducer = options.reducer || ((s, a) => ({ ...s, ...a.payload }));

  const key = getKey();
  console.log(key);

  const store = createContext<S, A>(key, {
    initialState: options.initialState,
    reducer: options.reducer
  });

  if (!store) return;

  const { Context, Provider, Consumer } = store;

  const useStore = useContext(Context);

  return {
    Context,
    Provider,
    Consumer,
    useStore
  };

}

export function createRestash<S extends object, U extends string>(options?: IStoreOptions<S, U>) {

  const reducer = (s, a) => toMerged(s, 'data', a.payload);

  const storeState: IStoreState<S, U> = {
    data: options.initialState
  };

  const store = createStore<IStoreState<S, U>, IAction<S>>({
    initialState: storeState,
    reducer
  });

  if (!store) return;

  const { Context, Provider, Consumer } = store;

  const useStore = () => {

    const mounted = useRef(false);
    const [state, setState] = useContext(Context);

    const dispatch = (s) => {
      const clone = { ...state };
      setState({
        type: null,
        payload: s
      });
      return toMerged(clone, 'data', s);
    };

    const restash: IRestashDispatch<S, U> = {
      dispatch: setState,
      get mounted() {
        return mounted.current;
      },
      get state() {
        return state.data;
      },
      get status() {
        return state.status;
      }
    };

    const withMiddleware = (...args: any) => (options.middleware)(restash)(args);
    const withoutMiddleware = (...args: any) => dispatch.apply(null, args);
    const dispatcher = (!options.middleware ? withoutMiddleware : withMiddleware)

    return [state.data, dispatcher as any]; // [S, (state: Partial<S>) => S];

  };

  return {
    Context,
    Provider,
    Consumer,
    useStore
  };

}

