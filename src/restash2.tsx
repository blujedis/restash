import React, { useRef, useState, createContext, useEffect, useReducer } from 'react';
import { thunkify, unwrap, getInitialState, validateState, isUndefined, isPlainObject, isEmpty } from './utils';
import {
  Middleware, Dispatch, IContext, IProvider, IRestashDispatch,
  Restash, IRestashInit, Status, Statuses
} from './types';
import { isString } from 'util';

// CONSTANTS //

const STATE_KEY = '__RESTASH_STATE__';

function createRestash<S extends object, U extends string>(
  initialState: S, statuses?: U[]): IRestashInit<S, U | Statuses>;

function createRestash<S extends object, U extends string>(
  statuses: U[]): IRestashInit<S, U | Statuses>;

function createRestash<S extends object, U extends string>(): IRestashInit<S, U | Statuses>;

function createRestash<S extends object, U extends string>(
  initialState?: S | U[],
  statuses?: U[]) {

  const inits = new Set();

  /**
   * Applies middleware wrapping for dispatch
   * 
   * @param middlewares and array of middlewares to be applied.
   */
  function applyMiddleware(...middlewares: Middleware<S, U>[]) {
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

  function createStore(middleware?: Middleware<S, U>) {

    if (Array.isArray(initialState)) {
      statuses = initialState;
      initialState = undefined;
    }

    let _initialState = initialState || {} as S;
    const _middleware = middleware;

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
    // tslint:disable-next-line: no-shadowed-variable
    function Provider({ initialState, children }: IProvider<S>) {

      // tslint:disable-next-line: prefer-const
      let [state, setState, restash] = useStore();

      _initialState = { ..._initialState, ...initialState };

      state = { ...state, ..._initialState };

      return (
        <Context.Provider value={{ state, setState, restash }}>
          {children}
        </Context.Provider>
      );

    }

    /**
     * Normalizer to ensure initial state type.
     * 
     * @param initState the initialState or key.
     * @param initValue the initial value when key is string.
     */
    function initValidateState(initState?, initValue?) {

      if (isPlainObject(initState)) {
        if (!isEmpty(_initialState)) {
          // tslint:disable-next-line: no-console
          console.warn(`Cannot update already initialized state, consider initializing a nested key.`);
          initState = undefined;
        }
      }
      else if (isString(initState)) {
        if (!inits.has(initState)) {
          inits.add(initState);
          initState = { [initState as string]: initValue } as any;
        }
        initState = undefined;
        initValue = undefined;
      }

      return () => {
        validateState(_initialState);
        _initialState = { ..._initialState, ...initState };
        return getInitialState(_initialState, STATE_KEY) as S;
      };


    }

    function useStore(initState?, initValue?) {

      // REFS //

      const mounted = useRef(false);
      const status = useRef<U>('INIT' as U);

      // REDUCER for STATE //

      const [state, setState] = useState({} as S);

      let nextState = state;
      let prevState = { ...nextState };

      useEffect(() => {
        mounted.current = true;
        return () => {
          mounted.current = false;
        };
      }, []);

      // Wraps reducer for normalized
      // state setter.
      const dispatch = (s, u): S => {
        if (u) status.current = u;
        nextState = { ...state, ...s };
        setState(nextState);
        prevState = { ...s };
        return nextState;
      };

      const restash: IRestashDispatch<S, U> = {
        dispatch,
        get mounted() {
          return mounted.current;
        },
        get state() {
          return nextState;
        },
        get status() {
          return status.current;
        }
      };

      const withMiddleware = (...args: any) => (_middleware)(restash)(args);
      const withoutMiddleware = (...args: any) => dispatch.apply(null, args);
      const dispatcher = (!_middleware ? withoutMiddleware : withMiddleware) as any;

      return [restash.state, dispatcher, restash];

    }

    function useStoreAt(key, value?) {
      const [state, setState, restash] = useStore(key, value);
      const dispatch = (v, u) => setState({ [key]: v }, u);
      return [restash.state[key], dispatch, restash];
    }

    // CONSUMER //

    const Consumer = Context.Consumer;

    // EXPORT RESTASH API //

    return {
      Context,
      Provider,
      Consumer,
      useStore,
      useStoreAt
    };

  }

  return {
    applyMiddleware,
    createStore
  };

}

export default createRestash;