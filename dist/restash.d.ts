import { StatusBaseTypes, StatusTypes, IStoreOptions, Middleware, IStore, IStoreBase } from './types';
/**
 * Checks if is a plain object.
 *
 * @param value the value to inspect.
 */
export declare function isPlainObject(value: unknown): boolean;
/**
 * Applies middleware wrapping for dispatch
 *
 * @param middlewares and array of middlewares to be applied.
 */
export declare function applyMiddleware<State extends IStoreBase<Themes, Statuses>, Themes extends object = {}, Statuses extends StatusBaseTypes = StatusTypes>(...middlewares: Middleware<State, Themes, Statuses>[]): Middleware<State, Themes, Statuses>;
/**
 * Creates a new store exposing hooks.
 *
 * @param options options for creating the store.
 */
export declare function createStore<State extends IStoreBase<Themes, Statuses>, Themes extends object = {}, Statuses extends StatusBaseTypes = StatusTypes>(options: IStoreOptions<State, Themes, Statuses>): IStore<State, Themes, Statuses>;
