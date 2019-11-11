import { ConsumerProps, ExoticComponent, Context } from "react";

export const MOUNTED = Symbol.for('MOUNTED');
export const STATUS = Symbol.for('STATUS');
export const THEME = Symbol.for('THEME');

export const StatusBase = {
  INIT: 'INIT',
  MOUNTED: 'MOUNTED'
};

export const StatusType = {
  ...StatusBase, ...{
    START: 'START',
    PROGRESS: 'PROGRESS',
    STOP: 'STOP',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR'
  }
};

export type KeyOf<T> = Extract<keyof T, string>;

export type ValueOf<T> = T[KeyOf<T>];

export type StatusBaseTypes = typeof StatusBase;

export type StatusTypes = typeof StatusType;

export interface IStoreBase<Statuses extends StatusBaseTypes, Themes extends object> {
  [MOUNTED]?: boolean;
  [STATUS]?: Statuses[KeyOf<Statuses>];
  [THEME]?: KeyOf<Themes>;
  [key: string]: any;
}

export interface IMiddlewareStore<State, Statuses> {
  dispatch?: StoreDispatch<State, Statuses>;
  getState?: () => State;
  getStatus?: () => KeyOf<Statuses>;
  isMounted?: boolean;
}

export type Middleware<State, Statuses extends StatusBaseTypes> = (
  store: IMiddlewareStore<State, Statuses>) => (next: StoreDispatch<State, Statuses>) => (payload: any) => State;

// DISPATCHERS //

export type StatusDispatch<Statuses> = (status: KeyOf<Statuses>) => void;

export type ThemeDispatch<Themes extends object> = (theme: KeyOf<Themes>) => void;

export type StoreDispatch<State, Statuses> = (state: State, status?: KeyOf<Statuses>) => void;

export type StoreAtDispatch<State, Statuses> = (key: ValueOf<State>, value: State[KeyOf<State>], status?: ValueOf<Statuses>) => void;

export type UseStoreContext<State, Statuses> =
  [State?, StoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?];

export type UseStoreAtContext<State, Statuses> =
  [State?, StoreAtDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?];

export type UseStatusContext<Statuses extends StatusBaseTypes, K extends KeyOf<Statuses>> =
  [Statuses[K]?, ThemeDispatch<Statuses>?, K?];

export type UseThemeContext<Themes extends object, K extends KeyOf<Themes>> =
  [Themes[K]?, ThemeDispatch<Themes>?, K?];

export interface IStoreProvider<State, Statuses> {

  /**
   * The initial store state, must be object.
   */
  initialState?: State;

  /**
   * Object containing enum like object of statuses.
   */
  statuses?: Statuses;

  /**
   * Provider child elements.
   */
  children?: any;

}

export interface IStoreOptions<
  State extends IStoreBase<Statuses, Themes>,
  Statuses extends StatusBaseTypes,
  Themes extends object> {

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

export interface IStore<State extends IStoreBase<Statuses, Themes>, Statuses extends StatusBaseTypes, Themes extends object> {

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
   * Exposes hook to store state at specified key.
   * 
   * @param key the nested state key to use.
   * @param initialValue the inital value for the nested key.
   */
  useStore<U extends State = State>(key: KeyOf<U>, initialValue: U[KeyOf<U>]): UseStoreAtContext<U, Statuses>;

  /**
   * Exposes hook to store state.
   * 
   * @param state the initial state to set for store.
   */
  useStore<U extends State = State>(initialState: U): UseStoreContext<U, Statuses>;

  /**
   * Exposes hook to store state.
   */
  useStore<U extends State = State>(): UseStoreContext<U, Statuses>;


  /**
   * Exposes status hook.
   * 
   * @param status the status to initialize with.
   */
  useStatus<K extends KeyOf<Statuses>>(status: K): UseStatusContext<Statuses, K>;

  /**
   * Exposes theme state hook.
   * 
   * @param theme the theme to load from thems when store was created.
   */
  useTheme<K extends KeyOf<Themes>>(theme: K): UseThemeContext<Themes, K>;

}
