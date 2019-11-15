"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const wouter_1 = require("wouter");
const store_1 = __importDefault(require("./store"));
const storeat_1 = __importDefault(require("./storeat"));
const menu_1 = __importDefault(require("./menu"));
const NotFound = (props) => {
    return (react_1.default.createElement("div", null, "404 - Not Found"));
};
const App = () => {
    return (react_1.default.createElement(wouter_1.Router, null,
        react_1.default.createElement("div", { style: { padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' } },
            react_1.default.createElement("div", null,
                react_1.default.createElement(menu_1.default, null)),
            react_1.default.createElement(wouter_1.Switch, null,
                react_1.default.createElement(wouter_1.Route, { path: "/", component: store_1.default }),
                react_1.default.createElement(wouter_1.Route, { path: "/storeat", component: storeat_1.default }),
                react_1.default.createElement(wouter_1.Route, { path: "/:404*", component: NotFound })))));
};
exports.default = App;
//# sourceMappingURL=app.js.map