import React from 'react';
import { IAction, IContextOptions, IProvider } from './types';
export declare function initContext<C extends object, A extends IAction = any>(options?: IContextOptions<C, A>): {
    Context: React.Context<[C, React.Dispatch<A>]>;
    Provider: ({ reducer, initialState, children }: IProvider<C, A>) => JSX.Element;
    Consumer: React.Consumer<[C, React.Dispatch<A>]>;
};
