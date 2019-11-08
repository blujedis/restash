import React, { FC } from 'react';
import { Route, Router } from 'wouter';
import Default from './default';
import Menu from './menu';

const App: FC = () => {

  return (
    <Router>
      <div style={{ padding: '24px' }} >
        <div>
          <Menu />
        </div>
        <Route path="/" component={Default} />
      </div>
    </Router>
  );

};

export default App;
