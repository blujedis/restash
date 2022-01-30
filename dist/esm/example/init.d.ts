/// <reference types="react" />
import { DeepPartial } from '../';
declare const Context: import("react").Context<[import("../types").IRestashState<DeepPartial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("react").Dispatch<import("../types").IRestashAction<"data", any>>]>, Consumer: import("react").Consumer<[import("../types").IRestashState<DeepPartial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("react").Dispatch<import("../types").IRestashAction<"data", any>>]>, Provider: ({ reducer, initialState, children }: import("../types").IProvider<import("../types").IRestashState<DeepPartial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("../types").IRestashAction<"data", any>>) => JSX.Element, useStore: {
    <K extends "firstName" | "lastName" | "age" | "numbers" | "numbers.mobile" | "numbers.home">(key: K, value?: any): import("../types").RestashHook<import("../types").PathValue<DeepPartial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, K>, "start" | "progress" | "error" | "complete", import("../types").Dispatch<import("../types").PathValue<DeepPartial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, K>, "start" | "progress" | "error" | "complete">>;
    (): import("../types").RestashHook<DeepPartial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "start" | "progress" | "error" | "complete", import("../types").Dispatch<DeepPartial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "start" | "progress" | "error" | "complete">>;
}, clearPersistence: {
    <K extends "firstName" | "lastName" | "age" | "numbers" | "numbers.mobile" | "numbers.home">(...keys: K[]): boolean;
    (...keys: string[]): boolean;
};
export { Context, Consumer, Provider, useStore, clearPersistence };
