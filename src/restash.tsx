
import { useContext } from 'react';
import { initContext, IContextOptions, IAction, IStoreAction } from './context';
import { toMerged } from './utils';

export interface IStoreState<U extends object> {
  data: U;
}

const contexts = new Set<string>();

export function createContext<S extends object, A extends IAction = any>(
  name: string,
  options: IContextOptions<S, A>) {
  if (contexts.has(name)) return null;
  contexts.add(name);
  return initContext(options);
}

export function createStore<U extends object>(initialState: U = {} as U) {

  const reducer = (s, a) => toMerged(s, 'data', a.payload);

  const storeState: IStoreState<U> = {
    data: initialState
  };

  const store = createContext<IStoreState<U>, IStoreAction<U>>('__RESTASH__', {
    initialState: storeState,
    reducer
  });

  if (!store) return;

  const { Context, Provider, Consumer } = store;

  const useStore = () => {

    const [state, dispatch] = useContext(Context);

    const dispatcher = (s) => {
      const clone = { ...state };
      dispatch({
        type: null,
        payload: s
      });
      return toMerged(clone, 'data', s);
    };

    return [state.data, dispatcher] as [U, (state: Partial<U>) => U];

  };

  return {
    Context,
    Provider,
    Consumer,
    useStore
  };

}