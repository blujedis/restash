/// <reference types="react" />
export interface IAppState {
    nested?: boolean;
    nestedObj?: {
        firstName?: string;
        lastName?: string;
    };
}
declare const Context: import("react").Context<[IAppState?, import("..").StoreDispatch<IAppState, {
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>?, string?, import("..").StatusDispatch<{
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>?, import("react").MutableRefObject<boolean>?]>;
declare const Provider: (options: import("..").IStoreProvider<IAppState, {
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>) => JSX.Element;
declare const Consumer: import("react").ExoticComponent<import("react").ConsumerProps<[IAppState?, import("..").StoreDispatch<IAppState, {
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>?, string?, import("..").StatusDispatch<{
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>?, import("react").MutableRefObject<boolean>?]>>;
declare const useStore: {
    (initialState?: IAppState): [IAppState?, import("..").StoreDispatch<IAppState, {
        START: string;
        PROGRESS: string;
        STOP: string;
        COMPLETE: string;
        ERROR: string;
        INIT: string;
        MOUNTED: string;
    }>?, string?, import("..").StatusDispatch<{
        START: string;
        PROGRESS: string;
        STOP: string;
        COMPLETE: string;
        ERROR: string;
        INIT: string;
        MOUNTED: string;
    }>?, import("react").MutableRefObject<boolean>?];
    <S extends import("..").IStoreBase<{
        light: {
            vars: {
                font: {
                    fontFamily: string;
                };
                color: {
                    primary: string;
                    secondary: string;
                    orange: string;
                    yellow: string;
                    green: string;
                    turquoise: string;
                    cyan: string;
                    blue: string;
                    purple: string;
                    red: string;
                };
                size: {
                    rem: {
                        ju: string;
                        xl: string;
                        lg: string;
                        md: string;
                        nm: string;
                        sm: string;
                        xs: string;
                        mi: string;
                    };
                    px: {
                        ju: string;
                        xl: string;
                        lg: string;
                        md: string;
                        nm: string;
                        sm: string;
                        xs: string;
                        mi: string;
                    };
                };
                query: {
                    xs: string;
                    sm: string;
                    md: string;
                    lg: string;
                    xl: string;
                    xxl: string;
                };
            };
        };
        dark: {
            vars: {
                font: {
                    fontFamily: string;
                };
                color: {
                    primary: string;
                    secondary: string;
                    other: string;
                    orange: string;
                    yellow: string;
                    green: string;
                    turquoise: string;
                    cyan: string;
                    blue: string;
                    purple: string;
                    red: string;
                };
                size: {
                    rem: {
                        ju: string;
                        xl: string;
                        lg: string;
                        md: string;
                        nm: string;
                        sm: string;
                        xs: string;
                        mi: string;
                    };
                    px: {
                        ju: string;
                        xl: string;
                        lg: string;
                        md: string;
                        nm: string;
                        sm: string;
                        xs: string;
                        mi: string;
                    };
                };
                query: {
                    xs: string;
                    sm: string;
                    md: string;
                    lg: string;
                    xl: string;
                    xxl: string;
                };
            };
        };
    }, {
        START: string;
        PROGRESS: string;
        STOP: string;
        COMPLETE: string;
        ERROR: string;
        INIT: string;
        MOUNTED: string;
    }>>(initialState?: S): [S?, import("..").StoreDispatch<S, {
        START: string;
        PROGRESS: string;
        STOP: string;
        COMPLETE: string;
        ERROR: string;
        INIT: string;
        MOUNTED: string;
    }>?, string?, import("..").StatusDispatch<{
        START: string;
        PROGRESS: string;
        STOP: string;
        COMPLETE: string;
        ERROR: string;
        INIT: string;
        MOUNTED: string;
    }>?, import("react").MutableRefObject<boolean>?];
};
declare const useTheme: <K extends "light" | "dark">(theme: K) => [{
    light: {
        vars: {
            font: {
                fontFamily: string;
            };
            color: {
                primary: string;
                secondary: string;
                orange: string;
                yellow: string;
                green: string;
                turquoise: string;
                cyan: string;
                blue: string;
                purple: string;
                red: string;
            };
            size: {
                rem: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
                px: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
            };
            query: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                xxl: string;
            };
        };
    };
    dark: {
        vars: {
            font: {
                fontFamily: string;
            };
            color: {
                primary: string;
                secondary: string;
                other: string;
                orange: string;
                yellow: string;
                green: string;
                turquoise: string;
                cyan: string;
                blue: string;
                purple: string;
                red: string;
            };
            size: {
                rem: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
                px: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
            };
            query: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                xxl: string;
            };
        };
    };
}[K]?, import("..").ThemeDispatch<{
    light: {
        vars: {
            font: {
                fontFamily: string;
            };
            color: {
                primary: string;
                secondary: string;
                orange: string;
                yellow: string;
                green: string;
                turquoise: string;
                cyan: string;
                blue: string;
                purple: string;
                red: string;
            };
            size: {
                rem: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
                px: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
            };
            query: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                xxl: string;
            };
        };
    };
    dark: {
        vars: {
            font: {
                fontFamily: string;
            };
            color: {
                primary: string;
                secondary: string;
                other: string;
                orange: string;
                yellow: string;
                green: string;
                turquoise: string;
                cyan: string;
                blue: string;
                purple: string;
                red: string;
            };
            size: {
                rem: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
                px: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
            };
            query: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                xxl: string;
            };
        };
    };
}>?, K?];
declare const useStatus: <K extends "MOUNTED" | "INIT" | "START" | "PROGRESS" | "STOP" | "COMPLETE" | "ERROR">(status?: {
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}[K]) => [{
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}[K]?, import("..").StatusDispatch<{
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>?];
declare const useStoreAt: <S extends import("..").IStoreBase<{
    light: {
        vars: {
            font: {
                fontFamily: string;
            };
            color: {
                primary: string;
                secondary: string;
                orange: string;
                yellow: string;
                green: string;
                turquoise: string;
                cyan: string;
                blue: string;
                purple: string;
                red: string;
            };
            size: {
                rem: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
                px: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
            };
            query: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                xxl: string;
            };
        };
    };
    dark: {
        vars: {
            font: {
                fontFamily: string;
            };
            color: {
                primary: string;
                secondary: string;
                other: string;
                orange: string;
                yellow: string;
                green: string;
                turquoise: string;
                cyan: string;
                blue: string;
                purple: string;
                red: string;
            };
            size: {
                rem: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
                px: {
                    ju: string;
                    xl: string;
                    lg: string;
                    md: string;
                    nm: string;
                    sm: string;
                    xs: string;
                    mi: string;
                };
            };
            query: {
                xs: string;
                sm: string;
                md: string;
                lg: string;
                xl: string;
                xxl: string;
            };
        };
    };
}, {
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}> = IAppState, K extends Extract<keyof S, string> = Extract<keyof S, string>>(key: K, initialValue?: S[K]) => [S[K]?, import("..").StoreAtDispatch<S[K], {
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>?, string?, import("..").StatusDispatch<{
    START: string;
    PROGRESS: string;
    STOP: string;
    COMPLETE: string;
    ERROR: string;
    INIT: string;
    MOUNTED: string;
}>?, import("react").MutableRefObject<boolean>?];
export * from '../';
export { Context, Provider, Consumer, useStore, useStoreAt, useTheme, useStatus };
