import React, { FC } from 'react';
import { Route, Router } from 'wouter';
import Default from './default';
import Nested from './nested';
import Any from './any';
import Theme from './theme';
import Menu from './menu';

const App: FC = () => {

  return (
    <Router>
      <div style={{ padding: '24px' }} >
        <div>
          <Menu />
        </div>
        <Route path="/" component={Default} />
        <Route path="/nested" component={Nested} />
        <Route path="/any" component={Any} />
        <Route path="/theme" component={Theme} />
      </div>
    </Router>
  );

};

export default App;
