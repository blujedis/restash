import { Middleware } from '../types';
declare const _styles: {
    head: string;
    stat: string;
    prev: string;
    next: string;
};
declare type Styles = typeof _styles;
export declare function logger<Y extends Styles = Styles>(styles?: Partial<Y>): Middleware;
export {};
