"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const init_1 = require("./init");
const Theme = () => {
    const [state, setState] = init_1.useStore('firstName');
    const onClick = () => {
        setState('Jason');
    };
    return (<div>
      <h2 style={{ marginBottom: '12px' }}>Theme</h2>
      <hr style={{ marginBottom: '20px' }}/>
      <div style={{ marginBottom: '12px' }}>
        Status
      </div>
      <div>
        <button type="button" onClick={onClick}>Set Jason</button>
      </div>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>);
};
exports.default = Theme;
//# sourceMappingURL=theme.jsx.map