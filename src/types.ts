export const DYNAMIC = Symbol('DYNAMIC');

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

export interface IStoreBase {
  [DYNAMIC]?: symbol;
  [key: string]: any;
}

export interface IMiddlewareStore<State, Statuses> {
  dispatch?: IStoreDispatch<State, Statuses>;
  getState?: () => State;
  getStatus?: () => ValueOf<Statuses>;
  isMounted?: boolean;
}

export type Middleware<State, Statuses extends StatusBaseTypes = StatusTypes> = (
  store: IMiddlewareStore<State, Statuses>) => IStoreDispatch<State, Statuses>;

export type StatusDispatch<Statuses> = (status: ValueOf<Statuses>) => void;

export type ThemeDispatch<Themes> = (theme: KeyOf<Themes>) => void;

export interface IStoreDispatch<State, Statuses> {
  (value: State, status?: ValueOf<Statuses>): void;
  <K extends keyof State>(key: K, value: State[K], status?: ValueOf<Statuses>): void;
  <K extends keyof State>(key: K): void;
}

export type UseStoreContext<State, Statuses> =
  [State?, IStoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?];

export type UseKeyContext<State, K extends keyof State, Statuses> =
  [State[K]?, IStoreDispatch<State[K], Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?];

export type UseThemeContext<Themes, K extends keyof Themes> =
  [Themes[K]?, K?, ThemeDispatch<Themes>?];

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
  State extends IStoreBase, Themes extends object, Statuses extends StatusBaseTypes> {

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
   * The state key used for initial state when using SSR.
   */
  stateKey?: string;

  /**
   * The key name to store the name of the active them if any.
   */
  themeKey?: KeyOf<State>;

  /**
   * A collection of theme objects.
   */
  themes?: Themes;

  /**
   * Dispatch status key values.
   */
  statuses?: Statuses;

}

export interface IStore<State extends IStoreBase, Themes extends object, Statuses extends object> {

  /**
   * The store's context.
   */
  Context: React.Context<[State?, IStoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?]>;

  /**
   * Creates a provider for the store context.
   * 
   * @param options the Provider's options.
   */
  Provider(options: IStoreProvider<State, Statuses>): JSX.Element;

  /**
   * Store consumer which enables access to the store inline within your JSX.Element.
   */
  Consumer: React.ExoticComponent<React.ConsumerProps<
    [State?, IStoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?]>>;

  /**
   * Exposes hook to store state.
   * 
   * @param state the initial state to set for store.
   * @param status the initial status if any to be set.
   */
  useStore(initialState?: Partial<State>, initialStatus?: ValueOf<Statuses>): UseStoreContext<State, Statuses>;

  /**
   * Exposes hook to store state by store key.
   * 
   * @param key a key in the store's state. 
   * @param value an optional initial value to be set.
   * @param status an optional initial status to be set.
   */
  useStoreAt<K extends KeyOf<State>>(
    key: K, initialValue?: State[K], initialStatus?: ValueOf<Statuses>): UseKeyContext<State, K, Statuses>;

  /**
   * Exposes theme state hook.
   * 
   * @param theme the theme to load from thems when store was created.
   */
  useTheme<K extends KeyOf<Themes>>(theme: K): UseThemeContext<Themes, K>;

  /**
   * Dynamically types state store based on initial value or type passed.
   * 
   * @param key the key to set the dynamic state at in main state.
   * @param initialState the initial state to be used.
   */

  useAny<DynamicState, K extends KeyOf<State>>(
    key: K, initState: Partial<DynamicState>): UseStoreContext<DynamicState, Statuses>;

  /**
   * Dynamically types state store based on initial value or type passed
   * stores dynamic state in symbol [DYNAMIC].
   * 
   * @param initialState the initial state to be used.
   */
  useAny<DynamicState>(initState: Partial<DynamicState>): UseStoreContext<DynamicState, Statuses>;

}
