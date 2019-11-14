import { Reducer, ReactNode } from 'react';
export declare enum Status {
    init = "init",
    mounted = "mounted"
}
export declare type StatusTypes = keyof typeof Status;
export declare enum Action {
    status = "status",
    data = "data"
}
export declare type ActionTypes = keyof typeof Action;
export declare type KeyOf<T> = Extract<keyof T, string>;
export interface IProvider<T extends object, A extends IAction = IAction> {
    initialState?: T;
    reducer?: Reducer<T, A>;
    children?: ReactNode;
}
export interface IAction {
    payload?: any;
}
export interface IContextOptions<T extends object, A extends IAction> {
    initialState?: T;
    reducer: Reducer<T, A>;
}
export interface IStoreOptions<S extends object, A extends IAction = IAction> {
    initialState?: S;
    reducer?: Reducer<S, A>;
}
export interface IRestashAction<T extends string = ActionTypes, P = any> {
    type: T;
    payload?: P;
}
export interface IRestashOptions<S extends object, U extends string> extends Omit<IStoreOptions<S>, 'reducer'> {
    middleware?: Middleware;
    statuses?: U[];
    persist?: string;
}
export interface IRestash<S, U extends string, D = Dispatch<S, U>> {
    dispatch: D;
    readonly mounted: boolean;
    readonly state: S;
    readonly status: U | StatusTypes;
    readonly key: string | null;
}
export declare type Dispatch<S, U extends string> = (state: S, status?: U) => S;
export declare type DispatchAt<S, U extends string, K extends KeyOf<S>> = (state: S[K], status?: U) => S;
export declare type MiddlewareDispatch = <S, U extends string>(state: S, status?: U) => S;
export declare type Middleware = <S, U extends string>(store: IRestash<S, U>) => (next: Dispatch<S, U>) => (payload: any) => S;
export interface IStoreState<S extends object, U extends string> {
    status?: U;
    data: S;
}
export declare type RestashHook<S, U extends string, D = Dispatch<S, U>> = [S, D, IRestash<S, U, D>];
