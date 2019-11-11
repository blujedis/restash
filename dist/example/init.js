"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const middleware_1 = require("../middleware");
const themes_1 = __importDefault(require("./themes"));
const middleware = __1.applyMiddleware(middleware_1.createLogger());
const appStore = __1.createStore({
    middleware,
    themes: themes_1.default
});
const Context = appStore.Context;
exports.Context = Context;
const Provider = appStore.Provider;
exports.Provider = Provider;
const Consumer = appStore.Consumer;
exports.Consumer = Consumer;
const useStore = appStore.useStore;
exports.useStore = useStore;
const useTheme = appStore.useTheme;
exports.useTheme = useTheme;
const useStatus = appStore.useStatus;
exports.useStatus = useStatus;
const useStoreAt = appStore.useStoreAt;
exports.useStoreAt = useStoreAt;
__export(require("../"));
//# sourceMappingURL=init.js.map