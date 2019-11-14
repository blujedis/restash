
import React, { createContext, useReducer, Dispatch } from 'react';
import { IAction, IContextOptions, IProvider } from './types';

export function initContext<C extends object, A extends IAction = any>(
  options?: IContextOptions<C, A>) {

  const Context = createContext<[C, Dispatch<A>]>(null);

  const Provider = ({ reducer, initialState, children }: IProvider<C, A>) => {
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


