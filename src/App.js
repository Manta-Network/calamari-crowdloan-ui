import React, { useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import { SubstrateContextProvider } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';
import { useTranslation } from 'react-i18next';
import { getLanguage } from 'utils/LocalStorageValue';

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(getLanguage());
    // eslint-disable-next-line
  }, []);
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
};
export default App;
