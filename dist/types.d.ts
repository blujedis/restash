import { ConsumerProps, ExoticComponent, Context, MutableRefObject } from 'react';
export declare const MOUNTED: unique symbol;
export declare const STATUS: unique symbol;
export declare const THEME: unique symbol;
export declare const StatusBase: {
    INIT: string;
    MOUNTED: string;
};
export declare const StatusType: {
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
};
export declare type KeyOf<T> = Extract<keyof T, string>;
export declare type ValueOf<T> = T[KeyOf<T>];
export declare type StatusBaseTypes = typeof StatusBase;
export declare type StatusTypes = typeof StatusType;
export interface IStoreBase<Themes extends object = {}, Statuses extends StatusBaseTypes = StatusTypes> {
    [MOUNTED]?: boolean;
    [STATUS]?: ValueOf<Statuses>;
    [THEME]?: KeyOf<Themes>;
    [key: string]: any;
}
export interface IMiddlewareStore<State, Statuses> {
    dispatch?: StoreDispatch<State, Statuses>;
    getState?: () => State;
    getStatus?: () => ValueOf<Statuses>;
    mounted?: boolean;
}
export declare type Middleware<State extends IStoreBase<Themes, Statuses>, Themes extends object = {}, Statuses extends StatusBaseTypes = StatusTypes> = (store: IMiddlewareStore<State, Statuses>) => (next: StoreDispatch<State, Statuses>) => (payload: any) => State;
export declare type StatusDispatch<Statuses> = (status: ValueOf<Statuses>) => void;
export declare type ThemeDispatch<Themes extends object> = (theme: KeyOf<Themes>) => void;
export declare type StoreDispatch<State, Statuses> = (state: State, status?: ValueOf<Statuses>) => void;
export declare type StoreAtDispatch<State, Statuses> = (key: ValueOf<State>, value?: State[KeyOf<State>], status?: ValueOf<Statuses>) => void;
export declare type UseStoreContext<State, Statuses> = [State?, StoreDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?, MutableRefObject<boolean>?];
export declare type UseStoreAtContext<State, Statuses> = [State?, StoreAtDispatch<State, Statuses>?, ValueOf<Statuses>?, StatusDispatch<Statuses>?, MutableRefObject<boolean>?];
export declare type UseStatusContext<Statuses extends StatusBaseTypes, V extends ValueOf<Statuses>> = [V?, StatusDispatch<Statuses>?];
export declare type UseThemeContext<Themes extends object, K extends KeyOf<Themes>> = [Themes[K]?, ThemeDispatch<Themes>?, K?];
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
export interface IStoreOptions<State extends IStoreBase<Themes, Statuses>, Themes extends object, Statuses extends StatusBaseTypes = StatusTypes> {
    /**
     * The initial store state, must be object.
     */
    initialState?: State;
    /**
     * Array of middleware functions.
     */
    middleware?: Middleware<State, Themes, Statuses>;
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
export interface IStore<State extends IStoreBase<Themes, Statuses>, Themes extends object, Statuses extends StatusBaseTypes = StatusTypes> {
    /**
     * The store's context.
     */
    Context: Context<UseStoreContext<State, Statuses>>;
    /**
     * Creates a provider for the store context.
     *
     * @param options the Provider's options.
     */
    Provider(options: IStoreProvider<State, Statuses>): JSX.Element;
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
    useStore<S extends IStoreBase<Themes, Statuses>>(initialState?: S): UseStoreContext<S, Statuses>;
    /**
     * Exposes hook to store state at dyanmically specified key.
     *
     * @param key the nested state key to use.
     * @param initialValue the inital value for the nested key.
     */
    useStoreAt<S extends IStoreBase<Themes, Statuses> = State, K extends KeyOf<S> = KeyOf<S>>(key: K, initialValue?: S[K]): UseStoreAtContext<S[K], Statuses>;
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
