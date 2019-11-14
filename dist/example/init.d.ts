/// <reference types="react" />
declare const Context: import("react").Context<[import("../types").IStoreState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, string>, import("react").Dispatch<import("../types").IRestashAction<"status" | "data", any>>]>, Consumer: import("react").ExoticComponent<import("react").ConsumerProps<[import("../types").IStoreState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, string>, import("react").Dispatch<import("../types").IRestashAction<"status" | "data", any>>]>>, Provider: ({ reducer, initialState, children }: import("../types").IProvider<import("../types").IStoreState<Partial<{
    firstName: string;
    lastName: string;
    age: number;
    numbers: {
        home: string;
        mobile: string;
    };
}>, string>, import("../types").IRestashAction<"status" | "data", any>>) => JSX.Element, useStore: {
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
    }>, string, K>, import("../types").IRestash<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>[K], string, import("../types").DispatchAt<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, string, K>>];
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
    }>, string>, import("../types").IRestash<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, string, import("../types").Dispatch<Partial<{
        firstName: string;
        lastName: string;
        age: number;
        numbers: {
            home: string;
            mobile: string;
        };
    }>, string>>];
};
export { Context, Consumer, Provider, useStore };
