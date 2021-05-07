import React from 'react';
import { Link } from 'wouter';
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
    return (React.createElement("div", null,
        React.createElement("img", { src: "/logo.png", width: "175", style: { marginBottom: '12px' } }),
        React.createElement("ul", { style: ul },
            React.createElement("li", { style: li },
                React.createElement(Link, { href: "/" }, "Store")),
            React.createElement("li", { style: li },
                React.createElement(Link, { href: "/storeat" }, "StoreAt")))));
};
export default Menu;
//# sourceMappingURL=menu.js.map