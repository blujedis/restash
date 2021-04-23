/// <reference types="react" />
declare const Context: import("react").Context<[import("../types").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("react").Dispatch<import("../types").IRestashAction<"data", any>>]>, Consumer: import("react").Consumer<[import("../types").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("react").Dispatch<import("../types").IRestashAction<"data", any>>]>, Provider: ({ reducer, initialState, children }: import("../types").IProvider<import("../types").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("../types").IRestashAction<"data", any>>) => JSX.Element, useStore: {
    <K extends "firstName" | "lastName" | "age" | "numbers">(key: K): import("../types").RestashAtHook<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>[K], "start" | "progress" | "error" | "complete", import("../types").DispatchAt<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "start" | "progress" | "error" | "complete", K>>;
    (): import("../types").RestashHook<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "start" | "progress" | "error" | "complete", import("../types").Dispatch<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "start" | "progress" | "error" | "complete">>;
}, clearPersistence: <K extends "firstName" | "lastName" | "age" | "numbers">(...filters: K[]) => boolean;
export { Context, Consumer, Provider, useStore, clearPersistence };
