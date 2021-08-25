import React from 'react';
import ReactDom from 'react-dom';
import App from './app';
import { Provider } from './init';

ReactDom.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
);
