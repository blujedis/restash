/// <reference types="react" />
declare const Context: import("react").Context<[import("..").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "init" | "mounted" | "progress" | "start" | "error" | "complete">, import("react").Dispatch<import("..").IRestashAction<"data", any>>]>, Consumer: import("react").ExoticComponent<import("react").ConsumerProps<[import("..").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "init" | "mounted" | "progress" | "start" | "error" | "complete">, import("react").Dispatch<import("..").IRestashAction<"data", any>>]>>, Provider: ({ reducer, initialState, children }: import("..").IProvider<import("..").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "init" | "mounted" | "progress" | "start" | "error" | "complete">, import("..").IRestashAction<"data", any>>) => JSX.Element, useStore: {
    <K extends "firstName" | "lastName" | "age" | "numbers">(key: K): [Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>[K], import("..").DispatchAt<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "progress" | "start" | "error" | "complete", K>];
    (): [Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, import("..").Dispatch<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "progress" | "start" | "error" | "complete">, import("..").IRestash<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "progress" | "start" | "error" | "complete", import("..").Dispatch<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "progress" | "start" | "error" | "complete">>];
};
export { Context, Consumer, Provider, useStore };
