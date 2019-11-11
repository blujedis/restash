"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const init_1 = require("./init");
const jsondata_1 = __importDefault(require("./jsondata"));
const types_1 = require("../types");
const Status = () => {
    const [state] = init_1.useStore({ name: '' });
    const [status, setStatus] = init_1.useStatus(types_1.StatusType.START);
    const changeStatus = (e) => {
        setStatus(e.target.value);
    };
    return (<div>
      <h2 style={{ marginBottom: '12px' }}>Status</h2>
      <hr style={{ marginBottom: '20px' }}/>
      <div style={{ marginBottom: '12px' }}>
        <span>Current Status: </span>
        <span style={{ fontWeight: 'bolder' }}>{status}</span>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <select onChange={changeStatus} value={status}>
          <option value=''>Please Select</option>
          <option>START</option>
          <option>PROGRESS</option>
          <option>STOP</option>
          <option>COMPLETE</option>
          <option>ERROR</option>
        </select>
      </div>
      <pre>
        <jsondata_1.default data={state}/>
      </pre>
    </div>);
};
exports.default = Status;
//# sourceMappingURL=status.jsx.map