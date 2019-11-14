"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
function initContext(options) {
    const Context = react_1.createContext(null);
    const Provider = ({ reducer, initialState, children }) => {
        const providerReducer = react_1.useReducer(options.reducer || reducer, { ...initialState, ...options.initialState });
        return (<Context.Provider value={providerReducer}>
        {children}
      </Context.Provider>);
    };
    const Consumer = Context.Consumer;
    return {
        Context,
        Provider,
        Consumer
    };
}
exports.initContext = initContext;
//# sourceMappingURL=context.jsx.map