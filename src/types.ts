import { Context, ExoticComponent } from "react";

export const MOUNTED = Symbol.for('MOUNTED');
export const STATUS = Symbol.for('STATUS');

export type Status = 'INIT' | 'MOUNTED';

export type KeyOf<T> = Extract<keyof T, string>;

export type ValueOf<T, K extends KeyOf<T> = any> = T[K];

export type Dispatch<S, U> =
  (state: S, status?: U) => S;

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

export interface IRestash<S, U extends string> {

  Context: Context<IContext<S, U>>;

  Provider: (options: IProvider<S>) => JSX.Element;

  Consumer: ExoticComponent<React.ConsumerProps<IContext<S, U>>>;

  useStore: () => Restash<S, U>;

}
