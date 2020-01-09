import { Reducer, ReactNode } from 'react';
/**
 * Base enum for initializing status.
 */
export declare enum StatusBase {
    /**
     * Store has init.
     */
    init = "init",
    /**
     * Store has mounted ready for use.
     */
    mounted = "mounted"
}
export declare type StatusBaseTypes = keyof typeof StatusBase;
/**
 * Defalt dispatch action.
 */
export declare enum Action {
    /**
     * Informs Restash you are dispatching data as the payload.
     */
    data = "data"
}
export declare type ActionTypes = keyof typeof Action;
export declare type KeyOf<T> = Extract<keyof T, string>;
/**
 * Context provider options.
 */
export interface IProvider<T extends object, A extends IAction = IAction> {
    /**
     * The initial state to use for the context.
     */
    initialState?: T;
    /**
     * The reducer used for dispatching the state.
     */
    reducer?: Reducer<T, A>;
    /**
     * Children to exposed Provider/Context to.
     */
    children?: ReactNode;
}
/**
 * Interface for default dispatch action.
 */
export interface IAction {
    /**
     * The data payload to dispatch and use for update.
     */
    payload?: any;
}
/**
 * Base default context
 */
export interface IContextOptions<T extends object, A extends IAction> {
    /**
     * The initial state of the Context.
     */
    initialState?: T;
    /**
     * The reducer for dispatching/updating Context.
     */
    reducer: Reducer<T, A>;
}
/**
 * Options for creating base store.
 */
export interface IStoreOptions<S extends object, A extends IAction = IAction> {
    /**
     * The initial state of the store.
     */
    initialState?: S;
    /**
     * The reducer used for dispatching store state.
     */
    reducer?: Reducer<S, A>;
}
/**
 * The dispatch action interface for Restash.
 */
export interface IRestashAction<T extends string = ActionTypes, P = any> {
    /**
     * The type of dispatch action to be handled.
     */
    type: T;
    /**
     * The dispatch status if any.
     */
    status?: any;
    /**
     * The payload or data to update.
     */
    payload?: P;
}
export declare enum DefaultStatus {
    start = "start",
    progress = "progress",
    error = "error",
    complete = "complete"
}
export declare type DefaultStatusTypes = keyof typeof DefaultStatus;
/**
 * Options used to create Restash context.
 */
export interface IRestashOptions<S extends object, U extends string> extends Omit<IStoreOptions<S>, 'reducer'> {
    /**
     * Optional middleware to be run prior to dispatching.
     */
    middleware?: Middleware;
    /**
     * Array of statuses to use as flag for triggering views in your app.
     */
    statuses?: U[];
    /**
     * When truthy indicates that you wish state to be persisted. On next load the previous states
     * will be loaded.
     */
    persistent?: string;
    /**
     * Array of keys in store that should be persisted.
     * when not defined all are stored at persistent key.
     */
    persistentKeys?: KeyOf<S>[];
    /**
     * A key used to load intital state in SSR environments from window if available.
     */
    ssrKey?: string | boolean;
}
/**
 * The combined Restash store state passed to middleware.
 */
export interface IRestash<S, U extends string, D = Dispatch<S, U>> {
    /**
     * The dispatch type/interface being used.
     */
    dispatch: D;
    /**
     * Indicates if Restash has mounted.
     */
    readonly mounted: boolean;
    /**
     * The current state of the Restash store.
     */
    readonly state: S;
    /**
     * The current Restash store status.
     */
    readonly status: U | StatusBaseTypes;
    /**
     * When useStore is init as const [stateAt, dispatchAt] = useStore('some_key')
     * the key supplied will be exposed to middleware here.
     */
    readonly key: string | null;
}
/**
 * Default dispactch type/interface.
 */
export declare type Dispatch<S, U extends string> = (state: S, status?: U) => S;
/**
 * Dispatch interface used when dispatching at a specific key in state.
 */
export declare type DispatchAt<S, U extends string, K extends KeyOf<S>> = (state: S[K], status?: U) => S;
/**
 * Intermediary type for middleware dispatch.
 */
export declare type MiddlewareDispatch = <S, U extends string>(state: S, status?: U) => S;
/**
 * Interface/type for middlware.
 */
export declare type Middleware = <S, U extends string>(store: IRestash<S, U>) => (next: Dispatch<S, U>) => (payload: any) => S;
/**
 * Restash store state.
 */
export interface IRestashState<S extends object, U extends string> {
    /**
     * The current status.
     */
    status?: U;
    /**
     * The current data store state.
     */
    data: S;
}
/**
 * The type/interface for the exposed Restash hook.
 */
export declare type RestashHook<S, U extends string, D = Dispatch<S, U>> = [S, D, IRestash<S, U, D>];
export declare type RestashAtHook<S, U extends string, D = Dispatch<S, U>> = [S, D];
