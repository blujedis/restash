import { Reducer, ReactNode } from 'react';

// HELPERS //

export enum StatusBase {
  init = 'init',
  mounted = 'mounted'
}

export type StatusBaseTypes = keyof typeof StatusBase;

export enum Action {
  data = 'data'
}

export type ActionTypes = keyof typeof Action;

export type KeyOf<T> = Extract<keyof T, string>;

// BASE TYPES //

export interface IProvider<T extends object, A extends IAction = IAction> {
  initialState?: T;
  reducer?: Reducer<T, A>;
  children?: ReactNode;
}

export interface IAction {
  payload?: any;
}

export interface IContextOptions<T extends object, A extends IAction> {
  initialState?: T;
  reducer: Reducer<T, A>;
}

export interface IStoreOptions<S extends object, A extends IAction = IAction> {
  initialState?: S;
  reducer?: Reducer<S, A>;
  ssrKey?: string | boolean; // a key used to load intital state in SSR environments.
}

// RESTASH //

export enum Status {
  init = 'init',
  mounted = 'mounted'
}

export type StatusTypes = keyof typeof Status;

export interface IProvider<T extends object, A extends IAction = IAction> {
  initialState?: T;
  reducer?: Reducer<T, A>;
  children?: ReactNode;
}

export interface IRestashAction<T extends string = ActionTypes, P = any> {
  type: T;
  status?: any; // may allow numeric in future.
  payload?: P;
}

export interface IRestashOptions<
  S extends object,
  U extends string> extends Omit<IStoreOptions<S>, 'reducer'> {
  middleware?: Middleware;
  statuses?: U[];
  persistent?: string; // when not null persists to local storage if available.
}

export interface IRestash<S, U extends string, D = Dispatch<S, U>> {
  dispatch: D;
  readonly mounted: boolean;
  readonly state: S;
  readonly status: U | StatusBaseTypes;
  readonly key: string | null;
}

export type Dispatch<S, U extends string> = (state: S, status?: U) => S;

export type DispatchAt<
  S,
  U extends string,
  K extends KeyOf<S>> = (state: S[K], status?: U) => S;

export type MiddlewareDispatch = <S, U extends string>(state: S, status?: U) => S;

export type Middleware =
  <S, U extends string>(store: IRestash<S, U>) => (next: Dispatch<S, U>) => (payload: any) => S;

export interface IStoreState<S extends object, U extends string> {
  status?: U;
  data: S;
}

export type RestashHook<S, U extends string, D = Dispatch<S, U>> =
  [S, D, IRestash<S, U, D>];