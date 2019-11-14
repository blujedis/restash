import { Context, ExoticComponent } from "react";

export enum Status {
  INIT,
  MOUNTED
}

export type Statuses = keyof typeof Status;

export type Dispatch<S, U> = (state: S, status?: U) => S;

export interface IRestashDispatch<S, U> {
  dispatch: Dispatch<S, U>;
  readonly mounted: boolean;
  readonly state: S;
  readonly status: U;
}

export interface IContext<S, U> {
  state?: S;
  setState?: Dispatch<S, U>;
  restash?: IRestashDispatch<S, U>;
}

export type Restash<S, U> =
  [S, (state: S, status?: U) => S, IRestashDispatch<S, U>];

export type Middleware<S, U> =
  (store: IRestashDispatch<S, U>) => (next: Dispatch<S, U>) => (payload: any) => S;

export interface IProvider<S> {

  /**
   * The initial store state, must be object.
   */
  initialState?: S;

  /**
   * Provider child elements.
   */
  children?: any;

}

type Combine<S, K extends string, V> = S & Partial<Record<K, V>>;

export interface IRestash<S, U> {

  Context: Context<IContext<S, U>>;

  Provider: (options: IProvider<S>) => JSX.Element;

  Consumer: ExoticComponent<React.ConsumerProps<IContext<S, U>>>;

  useStore<V, K extends string>(key: K, value?: V): Restash<Combine<S, K, V>, U>;

  useStore(initialState: S): Restash<S, U>;

  useStore(): Restash<S, U>;

  useStoreAt<K extends keyof S>(key: K, value?: S[K]): Restash<S[K], U>;

}

export interface IRestashInit<S, U> {
  applyMiddleware: (...middlewares: Middleware<S, U>[]) => Middleware<S, U>;
  createStore: (middleware?: Middleware<S, U>) => IRestash<S, U>;
}

