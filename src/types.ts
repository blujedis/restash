import { ConsumerProps, ExoticComponent, Context } from "react";

export const MOUNTED = Symbol('MOUNTED');
export const STATUS = Symbol('STATUS');

export const StatusBase = {
  INIT: 'INIT',
  MOUNTED: 'MOUNTED'
};

export const StatusType = {
  INIT: 'INIT',
  MOUNTED: 'MOUNTED',
  START: 'START',
  PROGRESS: 'PROGRESS',
  STOP: 'STOP',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
};

export type KeyOf<T> = Extract<keyof T, string>;

export type ValueOf<T> = T[KeyOf<T>];

export type StatusBaseTypes = typeof StatusBase;

export type StatusTypes = typeof StatusType;

export interface IStoreBase<Themes extends object> {
  [MOUNTED]?: symbol;
  theme?: KeyOf<Themes>;
  [key: string]: any;
}

export interface IMiddlewareStore<State, Statuses> {
  dispatch?: StoreDispatch<State, Statuses>;
  getState?: () => State;
  getStatus?: () => ValueOf<Statuses>;
  isMounted?: boolean;
}

// export type Middleware<State, Statuses extends StatusBaseTypes = StatusTypes> = (
//   store: IMiddlewareStore<State, Statuses>) => StoreDispatch<State, Statuses>;

export type Middleware<State, Statuses extends StatusBaseTypes = StatusTypes> = (
  store: IMiddlewareStore<State, Statuses>) => (next: StoreDispatch<State, Statuses>) => (payload: any) => State;

export type StatusDispatch<Statuses> = (status: ValueOf<Statuses>) => void;

export type ThemeDispatch<Themes> = (theme: KeyOf<Themes>) => void;

export type StoreDispatch<State, Statuses> = (state: State, status?: ValueOf<Statuses>) => void;

export type StoreAtDispatch<State, Statuses> = (key: ValueOf<State>, value: State[KeyOf<State>], status?: ValueOf<Statuses>) => void;

export type UseStoreContext<State, Statuses> =
  [State?, StoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?];

export type UseStoreAtContext<State, Statuses> =
  [State?, StoreAtDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?];

export type UseThemeContext<Themes, K extends KeyOf<Themes>> =
  [Themes[K]?, ThemeDispatch<Themes>?, K?];

export interface IStoreProvider<State, Statuses> {

  /**
   * The initial store state, must be object.
   */
  initialState?: State;

  /**
   * The initial status of the store.
   */
  initialStatus?: ValueOf<Statuses>;

  /**
   * Provider child elements.
   */
  children?: any;

}

export interface IStoreOptions<
  State extends IStoreBase<Themes>,
  Themes extends object,
  Statuses extends StatusBaseTypes> {

  /**
   * The initial store state, must be object.
   */
  initialState?: State;

  /**
   * Array of middleware functions.
   */
  middleware?: Middleware<State, Statuses>;

  /**
   * The initial status of the store.
   */
  initialStatus?: ValueOf<Statuses>;

  /**
   * A collection of theme objects.
   */
  themes?: Themes;

  /**
   * Dispatch status key values.
   */
  statuses?: Statuses;

}

export interface IStore<State extends IStoreBase<Themes>, Themes extends object, Statuses extends object> {

  /**
   * The store's context.
   */
  Context: Context<[State?, StoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?]>;

  /**
   * Creates a provider for the store context.
   * 
   * @param options the Provider's options.
   */
  Provider(options: IStoreProvider<State, Statuses>): JSX.Element;

  /**
   * Store consumer which enables access to the store inline within your JSX.Element.
   */
  Consumer: ExoticComponent<ConsumerProps<
    [State?, StoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?]>>;

  /**
   * Exposes hook to store state.
   * 
   * @param state the initial state to set for store.
   * @param status the initial status if any to be set.
   */
  useStore<U extends State = State>(key: KeyOf<U>, initialValue: Partial<U>[KeyOf<U>], initialStatus?: ValueOf<Statuses>): UseStoreAtContext<U, Statuses>;

  /**
   * Exposes hook to store state.
   * 
   * @param state the initial state to set for store.
   * @param status the initial status if any to be set.
   */
  useStore<U extends State = State>(initialState: Partial<U>, initialStatus?: ValueOf<Statuses>): UseStoreContext<U, Statuses>;

  /**
   * Exposes hook to store state.
   */
  useStore<U extends State = State>(): UseStoreContext<U, Statuses>;



  /**
   * Exposes theme state hook.
   * 
   * @param theme the theme to load from thems when store was created.
   */
  useTheme<K extends KeyOf<Themes>>(theme: K): UseThemeContext<Themes, K>;

}
