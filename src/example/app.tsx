import React, { FC } from 'react';
import { Route, Router, Switch } from 'wouter';
import Store from './store';
import Status from './status';
import Theme from './theme';
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
      <div style={{ padding: '24px' }} >
        <div>
          <Menu />
        </div>
        <Switch>
          <Route path="/" component={Store} />
          <Route path="/status" component={Status} />
          <Route path="/theme" component={Theme} />
          <Route path="/:404*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );

};

export default App;
