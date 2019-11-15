/// <reference types="react" />
declare const Context: import("react").Context<[import("../types").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "init" | "mounted" | "progress" | "start" | "error" | "complete">, import("react").Dispatch<import("../types").IRestashAction<"data", any>>]>, Consumer: import("react").ExoticComponent<import("react").ConsumerProps<[import("../types").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "init" | "mounted" | "progress" | "start" | "error" | "complete">, import("react").Dispatch<import("../types").IRestashAction<"data", any>>]>>, Provider: ({ reducer, initialState, children }: import("../types").IProvider<import("../types").IRestashState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, "init" | "mounted" | "progress" | "start" | "error" | "complete">, import("../types").IRestashAction<"data", any>>) => JSX.Element, useStore: {
    <K extends "firstName" | "lastName" | "age" | "numbers">(key: K): [Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>[K], import("../types").DispatchAt<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "progress" | "start" | "error" | "complete", K>, import("../types").IRestash<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>[K], "progress" | "start" | "error" | "complete", import("../types").DispatchAt<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "progress" | "start" | "error" | "complete", K>>];
    (): [Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, import("../types").Dispatch<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "progress" | "start" | "error" | "complete">, import("../types").IRestash<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, "progress" | "start" | "error" | "complete", import("../types").Dispatch<Partial<{
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
