
import React, { createContext,  useReducer, ReactNode, Reducer } from 'react';

export interface IProvider<S extends object> {
  initialState?: S;
  reducer?: Reducer<S, any>;
  children?: ReactNode;
}

export interface IAction {
  type: string;
}

export interface IStoreAction<S extends object> extends IAction {
  payload?: S;
}

export interface IContextOptions<S extends object, A extends IAction = any> {
  initialState?: S;
  reducer: Reducer<S, A>;
}

export function initContext<S extends object, A extends IAction = any>(
  options?: IContextOptions<S, A>) {

  const Context = createContext<[S, React.Dispatch<A>]>(null);

  const Provider = ({ reducer, initialState, children }: IProvider<S>) => {
    const providerReducer = 
      useReducer(options.reducer || reducer, { ...initialState, ...options.initialState });
    return (
      <Context.Provider value={providerReducer}>
        {children}
      </Context.Provider>
    );
  };  

  const Consumer = Context.Consumer;

  return {
    Context,
    Provider,
    Consumer
  };

}


