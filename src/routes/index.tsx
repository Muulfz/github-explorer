// eslint-disable-next-line no-use-before-define
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import GitRepository from '../pages/Repository';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/repositories/:repository+" component={GitRepository} />
  </Switch>
);

export default Routes;
