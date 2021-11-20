import { KeyOf } from "src";
export declare type StorageCallback = (err?: Error, data?: any) => void;
export declare type Storage = ReturnType<typeof asyncStorage>;
declare function asyncStorage(storage: any): {
    getItem: (key: string, cb: StorageCallback) => void;
    setItem: (key: string, value: any, cb: StorageCallback) => void;
    removeItem: (key: string, cb: StorageCallback) => void;
};
export declare function createStorage(storage: Storage): {
    getStorage: <S extends Record<string, any>>(key: string, filters?: Extract<keyof S, string>[]) => Promise<any>;
    setStorage: <S_1 extends Record<string, any>>(key: string, value: S_1, filters?: Extract<keyof S_1, string>[]) => Promise<any>;
    clearStorage: <S_2 extends Record<string, any>>(key: string, filters?: Extract<keyof S_2, string>[]) => Promise<boolean>;
};
export {};
