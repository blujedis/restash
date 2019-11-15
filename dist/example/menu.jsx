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
    return (<div>
      <img src="/logo.png" width="175" style={{ marginBottom: '12px' }}/>
      <ul style={ul}>
        <li style={li}><wouter_1.Link href="/">Store</wouter_1.Link></li>
        <li style={li}><wouter_1.Link href="/storeat">StoreAt</wouter_1.Link></li>
      </ul>
    </div>);
};
exports.default = Menu;
//# sourceMappingURL=menu.jsx.map