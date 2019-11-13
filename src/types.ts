
export const MOUNTED = Symbol.for('MOUNTED');
export const STATUS = Symbol.for('STATUS');

export type Status = 'INIT' | 'MOUNTED';

export type KeyOf<T> = Extract<keyof T, string>;

export type ValueOf<T, K extends KeyOf<T> = any> = T[K];

export interface IState {
  [key: string]: any;
}

export type Dispatch<S extends IState, U extends string> =
  (state: S, status?: ValueOf<U>) => S;

export interface IRestash<S extends IState, U extends string> {
  dispatch: Dispatch<S, U>;
  readonly mounted: boolean;
  readonly state: S;
  readonly status: string;
}

export interface IContext<S extends IState, U extends string> {
  state?: S;
  setState?: Dispatch<S, U>;
  restash?: IRestash<S, U>;
}

export type Restash<S extends IState, U extends string> =
  [S, (state: S, status?: ValueOf<U>) => S, IRestash<S, U>];

export type Middleware<S extends IState, U extends string> =
  (store: IRestash<S, U>) => (next: Dispatch<S, U>) => (payload: any) => S;

export interface IOptions<S extends IState, U extends string = Status> {

  /**
   * The initial store state, must be object.
   */
  initialState?: S;

  /**
   * Array of middleware functions.
   */
  middleware?: Middleware<S, U>;

  /**
   * Dispatch status key values.
   */
  statuses?: U[];

}

export interface IProvider<S extends IState> {

  /**
   * The initial store state, must be object.
   */
  initialState?: S;

  /**
   * Provider child elements.
   */
  children?: any;

}
