import React, { useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import { useTranslation } from 'react-i18next';
import { getLanguage } from 'utils/LocalStorageValue';
import { SubstrateContextProvider } from './substrate-lib';

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(getLanguage());
  }, [i18n]);
  return (
    <SubstrateContextProvider>
      <Router>
        <Switch>
          <Route path="/:referralCode" component={HomePage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Router>
    </SubstrateContextProvider>
  );
};
export default App;
