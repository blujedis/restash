/// <reference types="react" />
import { IAction, IContextOptions, Middleware, IRestashOptions, IStoreOptions, IStoreState, DispatchAt, IRestashAction } from './types';
/**
 * Gets a unique key based on number of loaded contexts.
 *
 * @param key the store key.
 */
export declare function getKey(key?: string): string;
/**
 * Applies middleware wrapping for dispatch
 *
 * @param middlewares and array of middlewares to be applied.
 */
export declare function applyMiddleware(...middlewares: Middleware[]): Middleware;
export declare function createContext<S extends object, A extends IAction>(name: string, options: IContextOptions<S, A>): {
    Context: import("react").Context<[S, import("react").Dispatch<A>]>;
    Provider: ({ reducer, initialState, children }: import("./types").IProvider<S, A>) => JSX.Element;
    Consumer: import("react").ExoticComponent<import("react").ConsumerProps<[S, import("react").Dispatch<A>]>>;
};
/**
 * Creates a simple persistent store.
 *
 * @param initialState the initial state of the store.
 */
export declare function createStore<S extends object, A extends IAction>(options?: IStoreOptions<S, A>): {
    Context: import("react").Context<[S, import("react").Dispatch<A>]>;
    Provider: ({ reducer, initialState, children }: import("./types").IProvider<S, A>) => JSX.Element;
    Consumer: import("react").ExoticComponent<import("react").ConsumerProps<[S, import("react").Dispatch<A>]>>;
    useStore: () => [S, import("react").Dispatch<A>];
};
export declare function createRestash<S extends object, U extends string>(options?: IRestashOptions<S, U>): {
    Context: import("react").Context<[IStoreState<S, "init" | "mounted" | U>, import("react").Dispatch<IRestashAction<"status" | "data", any>>]>;
    Provider: ({ reducer, initialState, children }: import("./types").IProvider<IStoreState<S, "init" | "mounted" | U>, IRestashAction<"status" | "data", any>>) => JSX.Element;
    Consumer: import("react").ExoticComponent<import("react").ConsumerProps<[IStoreState<S, "init" | "mounted" | U>, import("react").Dispatch<IRestashAction<"status" | "data", any>>]>>;
    useStore: {
        <K extends Extract<keyof S, string>>(key: K): [S[K], DispatchAt<S, U, K>, import("./types").IRestash<S[K], U, DispatchAt<S, U, K>>];
        (): [S, import("./types").Dispatch<S, U>, import("./types").IRestash<S, U, import("./types").Dispatch<S, U>>];
    };
};
