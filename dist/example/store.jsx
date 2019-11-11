"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const init_1 = require("./init");
const jsondata_1 = __importDefault(require("./jsondata"));
const Store = () => {
    const [stateAt, setStateAt] = init_1.useStoreAt('nested');
    const [state, setState] = init_1.useStore();
    const changeState = (e) => {
        setStateAt(e.target.value);
    };
    const changeStateAt = (e) => {
        setStateAt(e.target.value);
    };
    return (<div>
      <h2 style={{ marginBottom: '12px' }}>Store</h2>
      <hr style={{ marginBottom: '20px' }}/>
      <div style={{ marginBottom: '12px' }}>
        <span>Current Value: </span>
        <span style={{ fontWeight: 'bolder' }}>{stateAt || ''}</span>
      </div>
      <div style={{ marginBottom: '24px' }}>

      </div>
      <h4>Current State</h4>
      <pre>
        <jsondata_1.default data={state}/>
      </pre>
    </div>);
};
exports.default = Store;
//# sourceMappingURL=store.jsx.map