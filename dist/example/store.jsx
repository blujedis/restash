"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const init_1 = require("./init");
const Store = () => {
    const [state, setState, restash] = init_1.useStore();
    // const [stateAt, setStateAt] = useStore('age');
    const onClick = () => {
        setState({ firstName: 'Larry' });
        setState({ age: 47 });
    };
    return (<div>
      <h2 style={{ marginBottom: '12px' }}>Store</h2>
      <hr style={{ marginBottom: '20px' }}/>
      <div style={{ marginBottom: '12px' }}>
        Status: {restash.status}
      </div>
      <div>
        <button type="button" onClick={onClick}>Set Larry</button>
      </div>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>);
};
exports.default = Store;
//# sourceMappingURL=store.jsx.map