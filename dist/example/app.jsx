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
    return (<div>
      404 - Not Found
    </div>);
};
const App = () => {
    return (<wouter_1.Router>
      <div style={{ padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }}>
        <div>
          <menu_1.default />
        </div>
        <wouter_1.Switch>
          <wouter_1.Route path="/" component={store_1.default}/>
          <wouter_1.Route path="/storeat" component={storeat_1.default}/>
          <wouter_1.Route path="/:404*" component={NotFound}/>
        </wouter_1.Switch>
      </div>
    </wouter_1.Router>);
};
exports.default = App;
//# sourceMappingURL=app.jsx.map