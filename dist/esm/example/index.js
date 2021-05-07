import React from 'react';
import ReactDom from 'react-dom';
import App from './app';
import { Provider } from './init';
ReactDom.render(React.createElement(Provider, null,
    React.createElement(App, null)), document.getElementById('root'));
//# sourceMappingURL=index.js.map