"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const wouter_1 = require("wouter");
const store_1 = __importDefault(require("./store"));
const status_1 = __importDefault(require("./status"));
const theme_1 = __importDefault(require("./theme"));
const menu_1 = __importDefault(require("./menu"));
const NotFound = (props) => {
    return (<div>
      404 - Not Found
    </div>);
};
const App = () => {
    return (<wouter_1.Router>
      <div style={{ padding: '24px' }}>
        <div>
          <menu_1.default />
        </div>
        <wouter_1.Switch>
          <wouter_1.Route path="/" component={store_1.default}/>
          <wouter_1.Route path="/status" component={status_1.default}/>
          <wouter_1.Route path="/theme" component={theme_1.default}/>
          <wouter_1.Route path="/:404*" component={NotFound}/>
        </wouter_1.Switch>

      </div>
    </wouter_1.Router>);
};
exports.default = App;
//# sourceMappingURL=app.jsx.map