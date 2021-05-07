import React from 'react';
import { Route, Router, Switch } from 'wouter';
import Store from './store';
import StoreAt from './storeat';
import Menu from './menu';
const NotFound = (props) => {
    return (React.createElement("div", null, "404 - Not Found"));
};
const App = () => {
    return (React.createElement(Router, null,
        React.createElement("div", { style: { padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' } },
            React.createElement("div", null,
                React.createElement(Menu, null)),
            React.createElement(Switch, null,
                React.createElement(Route, { path: "/", component: Store }),
                React.createElement(Route, { path: "/storeat", component: StoreAt }),
                React.createElement(Route, { path: "/:404*", component: NotFound })))));
};
export default App;
//# sourceMappingURL=app.js.map