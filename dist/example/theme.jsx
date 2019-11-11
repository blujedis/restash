"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const init_1 = require("./init");
const jsondata_1 = __importDefault(require("./jsondata"));
const Theme = () => {
    const [theme, setTheme, currentTheme] = init_1.useTheme('light');
    const changeTheme = async (e) => {
        const val = e.target.value;
        setTheme(val);
    };
    const colors = () => !theme || !theme.vars ? {} : theme.vars.color;
    return (<div>
      <h2 style={{ marginBottom: '12px' }}>Theme</h2>
      <hr style={{ marginBottom: '20px' }}/>
      <div style={{ marginBottom: '12px' }}>
        <span>Current Theme: </span>
        <span style={{ fontWeight: 'bolder' }}>{currentTheme}</span>
      </div>
      <div style={{ marginBottom: '24px' }}>
        <select onChange={changeTheme} value={currentTheme}>
          <option value=''>Please Select</option>
          <option>light</option>
          <option>dark</option>
        </select>
      </div>
      <h4 style={{ marginBottom: '8px' }}>Display Our Theme Vars</h4>
      <div style={{ fontSize: '.85rem', color: '#666' }}>(showing ONLY vars for brevity)</div>
      <pre>
        <jsondata_1.default data={colors()} label={'Current Theme Colors'}/>
      </pre>
    </div>);
};
exports.default = Theme;
//# sourceMappingURL=theme.jsx.map