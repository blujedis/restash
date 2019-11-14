import { Reducer, ReactNode } from 'react';

export interface IProvider<T, A = IAction> {
  initialState?: T;
  reducer?: Reducer<T, A>;
  children?: ReactNode;
}

export interface IAction<P = any> {
  type: string;
  payload?: P;
}

export interface IContextOptions<T extends object, A extends IAction = any> {
  initialState?: T;
  reducer: Reducer<T, A>;
}

export interface IStoreBaseOptions<S, A = IAction> {
  initialState?: S;
  reducer: Reducer<S, A>;
}

export interface IStoreOptions<S, U> extends IStoreBaseOptions<S> {
  middleware?: Middleware;
  statuses?: U[];
}

export interface IRestashDispatch<S, U> {
  dispatch: Dispatcher;
  readonly mounted: boolean;
  readonly state: S;
  readonly status: U;
}

export type Dispatcher = <S, U>(state: S, status?: U) => S;

export type Middleware =
  <S, U>(store: IRestashDispatch<S, U>) => (next: Dispatcher) => (payload: any) => S;

export interface IStoreState<S, U> {
  status?: U;
  data: S;
}