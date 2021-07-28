import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.scss';
import './common/i18n/i18n';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import config from 'config';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const CalamariCrowdloanUI = async () => {
  await cryptoWaitReady();
  const extensions = await web3Enable(config.APP_NAME);
  console.log('extensions', extensions);
  let allAccounts = await web3Accounts();
  allAccounts = allAccounts.map(({ address, meta }) =>
    ({ address, meta: { ...meta, name: meta.name } }));
  keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);
  ReactDOM.render(<App />, document.getElementById('root'));
};
CalamariCrowdloanUI();
