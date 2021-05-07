import React, { createContext, useReducer } from 'react';
export function initContext(options) {
    const Context = createContext(null);
    const Provider = ({ reducer, initialState, children }) => {
        const providerReducer = useReducer(options.reducer || reducer, { ...initialState, ...options.initialState });
        return (React.createElement(Context.Provider, { value: providerReducer }, children));
    };
    const Consumer = Context.Consumer;
    return {
        Context,
        Provider,
        Consumer
    };
}
//# sourceMappingURL=context.js.map