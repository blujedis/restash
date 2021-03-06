import React, { FC } from 'react';
import { Route, Router, Switch } from 'wouter';
import Store from './store';
import StoreAt from './storeat';
import Menu from './menu';

const NotFound: FC = (props) => {
  return (
    <div>
      404 - Not Found
    </div>
  );
};

const App: FC = () => {

  return (
    <Router>
      <div style={{ padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' }} >
        <div>
          <Menu />
        </div>
        <Switch>
          <Route path="/" component={Store} />
          <Route path="/storeat" component={StoreAt} />
          <Route path="/:404*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );

};

export default App;
