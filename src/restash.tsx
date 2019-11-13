import React, { useRef, useState, createContext, useEffect } from 'react';
import { IOptions, Status, Middleware, Dispatch, IState, IContext, IProvider, IRestash, ValueOf, Restash, MOUNTED, STATUS } from './types';
import { thunkify, unwrap, getInitialState, validateState, isUndefined } from './utils';


// CONSTANTS //

const STATE_KEY = '__RESTASH_STATE__';

/**
 * Applies middleware wrapping for dispatch
 * 
 * @param middlewares and array of middlewares to be applied.
 */
export function applyMiddleware<S extends IState, U extends string = Status>(...middlewares: Middleware<S, U>[]) {
  middlewares = middlewares.slice();
  middlewares = [thunkify(), ...middlewares, unwrap()] as any;
  middlewares.reverse();
  const handler: any = (store) => {
    let dispatch = store.dispatch;
    middlewares.forEach(m => (dispatch = m(store)(dispatch)));
    return dispatch as Dispatch<S, U>;
  };
  return handler as Middleware<S, U>;
}

export function createStore<S extends IState, U extends string = Status>(
  options?: IOptions<S, U>) {

  let _initialState = (options.initialState || {}) as S;

  // CONTEXT //

  const Context = createContext<IContext<S, U>>({});

  // Set the default context display name.
  Context.displayName = 'Restash';

  // PROVIDER //

  /**
   * Inits the provider and ReactContext.
   * 
   * @param options initialState and Provider children.
   */
  function Provider({ initialState, children }: IProvider<S>) {

    // tslint:disable-next-line: prefer-const
    let [state, setState, store] = useStore();

    _initialState = { ..._initialState, ...initialState };

    state = { ...state, ..._initialState };

    return (
      <Context.Provider value={{ state, setState, restash: store }}>
        {children}
      </Context.Provider>
    );

  }

  /**
   * Gets and validates the initial state.
   */
  function initValidateState<I extends IState>(initState?: I) {
    return () => {
      validateState(_initialState);
      _initialState = { ..._initialState, ...initState };
      return getInitialState(_initialState, STATE_KEY) as I;
    };
  }

  /**
   * Base Restash hook.
   */
  function useStore() {

    // Init State, Theme and Status //

    const mounted = useRef(false);
    const status = useRef('INIT');
    const [state, setState] = useState<S>(initValidateState());

    useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
      };
    }, []);

    let nextState = state;
    let prevState = nextState;

    const dispatch = (s, u): S => {

      // Nothing to update.
      if (isUndefined(s) && isUndefined(u)) return s;

      // If status passed set 
      if (u) status.current = u;

      // Clone the state.
      nextState = { ...state, ...prevState, ...s };

      // Update the restate state.
      setState(s);

      // Store the previous state.
      prevState = { ...s };

      return nextState;

    };

    const restash: IRestash<S, U> = {
      dispatch,
      get mounted() {
        return mounted.current;
      },
      get state() {
        return state;
      },
      get status() {
        return status.current;
      }
    };

    const withMiddleware = (...args: any) => (options.middleware)(restash)(args);
    const withoutMiddleware = (...args: any) => dispatch.apply(null, args);
    const dispatcher = !options.middleware ? withoutMiddleware : withMiddleware;

    return [nextState, dispatcher as any, restash] as Restash<S, U>;

  }

  // CONSUMER //

  const Consumer = Context.Consumer;

  // EXPORT RESTASH API //

  return {
    Context,
    Provider,
    Consumer,
    useStore
  };

}