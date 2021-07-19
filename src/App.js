import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import { SubstrateContextProvider } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

export default function App () {
  return (
    <SubstrateContextProvider>
      <Router>
        <Switch>
          <Route path="/" component={HomePage} exact />
        </Switch>
      </Router>
      <DeveloperConsole />
    </SubstrateContextProvider>
  );
}
