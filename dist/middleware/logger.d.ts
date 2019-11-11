import { Middleware } from '../types';
export declare function createLogger<App>(): Middleware<App, {}, {
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>;
