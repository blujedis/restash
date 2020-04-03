/// <reference types="react" />
declare const Context: import("react").Context<[import("..").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("react").Dispatch<import("..").IRestashAction<"data", any>>]>, Consumer: import("react").Consumer<[import("..").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("react").Dispatch<import("..").IRestashAction<"data", any>>]>, Provider: ({ reducer, initialState, children }: import("..").IProvider<import("..").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "start" | "progress" | "error" | "complete" | "init" | "mounted">, import("..").IRestashAction<"data", any>>) => JSX.Element, useStore: {
    <K extends "firstName" | "lastName" | "age" | "numbers">(key: K): import("..").RestashAtHook<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>[K], "start" | "progress" | "error" | "complete", import("..").DispatchAt<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "start" | "progress" | "error" | "complete", K>>;
    (): import("..").RestashHook<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "start" | "progress" | "error" | "complete", import("..").Dispatch<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "start" | "progress" | "error" | "complete">>;
}, clearPersistence: <K extends "firstName" | "lastName" | "age" | "numbers">(filters?: K[]) => boolean;
export { Context, Consumer, Provider, useStore, clearPersistence };
