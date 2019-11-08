import React from 'react';
import ReactDom from 'react-dom';
import App from './app';
import { Provider } from './store';

ReactDom.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root')
);
