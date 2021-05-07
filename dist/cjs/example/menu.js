"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const wouter_1 = require("wouter");
const ul = {
    padding: '0',
    margin: '12px 0',
    listStyle: 'none'
};
const li = {
    display: 'inline-block',
    marginRight: '8px'
};
const Menu = () => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("img", { src: "/logo.png", width: "175", style: { marginBottom: '12px' } }),
        react_1.default.createElement("ul", { style: ul },
            react_1.default.createElement("li", { style: li },
                react_1.default.createElement(wouter_1.Link, { href: "/" }, "Store")),
            react_1.default.createElement("li", { style: li },
                react_1.default.createElement(wouter_1.Link, { href: "/storeat" }, "StoreAt")))));
};
exports.default = Menu;
//# sourceMappingURL=menu.js.map