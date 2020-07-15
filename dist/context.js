"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initContext = void 0;
const react_1 = __importStar(require("react"));
function initContext(options) {
    const Context = react_1.createContext(null);
    const Provider = ({ reducer, initialState, children }) => {
        const providerReducer = react_1.useReducer(options.reducer || reducer, { ...initialState, ...options.initialState });
        return (react_1.default.createElement(Context.Provider, { value: providerReducer }, children));
    };
    const Consumer = Context.Consumer;
    return {
        Context,
        Provider,
        Consumer
    };
}
exports.initContext = initContext;
//# sourceMappingURL=context.js.map