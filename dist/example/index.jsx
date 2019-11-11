"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const app_1 = __importDefault(require("./app"));
const init_1 = require("./init");
react_dom_1.default.render(<init_1.Provider>
    <app_1.default />
  </init_1.Provider>, document.getElementById('root'));
//# sourceMappingURL=index.jsx.map