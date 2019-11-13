import React from 'react';
import ReactDom from 'react-dom';
import App from './app';
import { Provider } from './init';

ReactDom.render(
  <Provider initialState={{ name: 'bobby' }}>
    <App />
  </Provider>,
  document.getElementById('root')
);
