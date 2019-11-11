import { ConsumerProps, ExoticComponent, Context, MutableRefObject } from 'react';

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

export interface IStoreState<State, Themes extends object, Statuses extends StatusBaseTypes> {
  mounted?: boolean;
  status?: ValueOf<Statuses>;
  theme?: KeyOf<Themes>;
  state?: State;
}

export interface IMiddlewareStore<State, Statuses> {
  dispatch?: StoreDispatch<State, Statuses>;
  getState?: () => State;
  getStatus?: () => ValueOf<Statuses>;
  mounted?: boolean;
}

export type Middleware<
  State,
  Statuses extends StatusBaseTypes = StatusTypes> = (
    store: IMiddlewareStore<State, Statuses>) =>
    (next: StoreDispatch<State, Statuses>) =>
      (payload: any) => State;

// DISPATCHERS //

export type StatusDispatch<Statuses> = (status: ValueOf<Statuses>) => void;

export type ThemeDispatch<Themes extends object> = (theme: KeyOf<Themes>) => void;

export type StoreDispatch<State, Statuses> = (state: State, status?: ValueOf<Statuses>) => void;

export type StoreAtDispatch<State, Statuses> = (key: ValueOf<State>, value?: State[KeyOf<State>], status?: ValueOf<Statuses>) => void;



export type UseStoreContext<State, Statuses> =
  [State?, StoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?, MutableRefObject<boolean>?, MutableRefObject<Set<any>>?];

export type UseStoreAtContext<State, Statuses> =
  [State?, StoreAtDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?, MutableRefObject<boolean>?, MutableRefObject<Set<any>>?];

export type UseStatusContext<Statuses extends StatusBaseTypes, V extends ValueOf<Statuses>> =
  [V?, StatusDispatch<Statuses>?];

export type UseThemeContext<Themes extends object, K extends KeyOf<Themes>> =
  [Themes[K]?, ThemeDispatch<Themes>?, K?];

export interface IStoreProvider<State> {

  /**
   * The initial store state, must be object.
   */
  initialState?: State;

  /**
   * Provider child elements.
   */
  children?: any;

}

export interface IStoreOptions<
  State extends object,
  Themes extends object = {},
  Statuses extends StatusBaseTypes = StatusTypes> {

  /**
   * The initial store state, must be object.
   */
  initialState?: State;

  /**
   * Array of middleware functions.
   */
  middleware?: Middleware<State, Statuses>;

  /**
   * A collection of theme objects.
   */
  themes?: Themes;

  /**
   * Dispatch status key values.
   */
  statuses?: Statuses;

}

export interface IStore<
  State extends object,
  Themes extends object,
  Statuses extends StatusBaseTypes = StatusTypes> {

  /**
   * The store's context.
   */
  Context: Context<UseStoreContext<State, Statuses>>;

  /**
   * Creates a provider for the store context.
   * 
   * @param options the Provider's options.
   */
  Provider(options: IStoreProvider<State>): JSX.Element;

  /**
   * Store consumer which enables access to the store inline within your JSX.Element.
   */
  Consumer: ExoticComponent<ConsumerProps<UseStoreContext<State, Statuses>>>;

  /**
   * Exposes hook to store state.
   * 
   * @param state the initial state to set for store.
   */
  useStore(initialState?: State): UseStoreContext<State, Statuses>;

  /**
   * Exposes hook to store state.
   * 
   * @param state the initial state to set for store.
   */
  useStore<S extends object>(initialState?: S): UseStoreContext<S, Statuses>;

  /**
   * Exposes hook to store state at dyanmically specified key.
   * 
   * @param key the nested state key to use.
   * @param initialValue the inital value for the nested key.
   */
  useStoreAt<S extends object = State, K extends KeyOf<S> = KeyOf<S>>(key: K, initialValue?: S[K]): UseStoreAtContext<S[K], Statuses>;


  /**
   * Exposes status hook.
   * 
   * @param status the status to initialize with.
   */
  useStatus<K extends KeyOf<Statuses>>(status?: Statuses[K]): UseStatusContext<Statuses, Statuses[K]>;

  /**
   * Exposes theme state hook.
   * 
   * @param theme the theme to load from thems when store was created.
   */
  useTheme<K extends KeyOf<Themes>>(theme: K): UseThemeContext<Themes, K>;

}
