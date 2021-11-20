/// <reference types="react" />
import { IAction, IContextOptions, Middleware, IRestashOptions, IStoreOptions, IRestashState, RestashHook, IRestashAction, DefaultStatusTypes, Path, PathValue } from './types';
/**
 * Applies middleware wrapping for dispatch
 *
 * @param middlewares and array of middlewares to be applied.
 */
export declare function applyMiddleware(...middlewares: Middleware[]): Middleware;
/**
 * Creates a context for persisting data in your application, createContext is used by
 * both createStore and createRestash.
 *
 * @example
 * const store = createContext<S, A>({
 *   initialState: options.initialState,
 *   reducer: options.reducer
 * });
 *
 * @param options context options used to initialize.
 */
export declare function createContext<S extends Record<string, any>, A extends IAction>(options: IContextOptions<S, A>): {
    Context: import("react").Context<[S, import("react").Dispatch<A>]>;
    Provider: ({ reducer, initialState, children }: import("./types").IProvider<S, A>) => JSX.Element;
    Consumer: import("react").Consumer<[S, import("react").Dispatch<A>]>;
};
/**
 * Creates store using default or provided reducer and dispatch action which contains
 * one property "payload" for your data.
 *
 * @example
 * import { createStore } from 'restash';
 * const { useStore } = createStore({ initialState: {} });
 * const App = () => {
 *  const [state, dispatch] = useStore();
 *  return (
 *    <pre>
 *      {JSON.stringify(state, null, 2)}
 *    </pre>
 *  );
 * };
 *
 *
 * @param options base options to initialize context.
 */
export declare function createStore<S extends Record<string, any>, A extends IAction>(options?: IStoreOptions<S, A>): {
    Context: import("react").Context<[S, import("react").Dispatch<A>]>;
    Provider: ({ reducer, initialState, children }: import("./types").IProvider<S, A>) => JSX.Element;
    Consumer: import("react").Consumer<[S, import("react").Dispatch<A>]>;
    useStore: () => [S, import("react").Dispatch<A>];
};
/**
 * Creates Restash store instance with simple opinionated reducer for typical persistent tasks.
 *
 * @example
 * import { createRestash } from 'restash';
 * const { useStore } = createRestash({ initialState: {}, persist: 'MyApp' });
 * const App = () => {
 *  const [state, dispatch, restash] = useStore();
 *  return (
 *    <pre>
 *      {JSON.stringify(state, null, 2)}
 *    </pre>
 *  );
 * };
 *
 *
 * @param options options used to initialize Restash.
 */
export declare function createRestash<S extends Record<string, any>, U extends string = DefaultStatusTypes>(options?: IRestashOptions<S, U>): {
    Context: import("react").Context<[IRestashState<S, "init" | "mounted" | U>, import("react").Dispatch<IRestashAction<"data", any>>]>;
    Provider: ({ reducer, initialState, children }: import("./types").IProvider<IRestashState<S, "init" | "mounted" | U>, IRestashAction<"data", any>>) => JSX.Element;
    Consumer: import("react").Consumer<[IRestashState<S, "init" | "mounted" | U>, import("react").Dispatch<IRestashAction<"data", any>>]>;
    useStore: {
        <K extends Path<S>>(key: K, value?: any): RestashHook<PathValue<S, K>, U, import("./types").Dispatch<PathValue<S, K>, U>>;
        (): RestashHook<S, U, import("./types").Dispatch<S, U>>;
    };
    clearPersistence: <K_1 extends Extract<keyof S, string>>(...keys: K_1[]) => boolean;
};
