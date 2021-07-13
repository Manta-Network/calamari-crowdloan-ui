import React, { useState, useEffect, createRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Menu,
  Button,
  Dropdown,
  Icon,
  Label
} from 'semantic-ui-react';
import Decimal from 'decimal.js'

import { useSubstrate } from './substrate-lib';
import { KusamaFromAtomicUnits } from './utils/KusamaToAtomicUnits'

function Main (props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress, setAccountBalance, accountBalance } = props;
  const [accountSelected, setAccountSelected] = useState();
  const { api } = useSubstrate()
  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccountAddress(initialAddress);
    setAccountSelected(initialAddress);
  }, [setAccountAddress, initialAddress]);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;
    // If the user has selected an address, create a new subscription
    accountSelected &&
    api.query.system.account(accountSelected, balance => {
        const rawBalance = new Decimal(balance.data.free.toString())
        setAccountBalance(KusamaFromAtomicUnits(rawBalance, api).toString());
      })
        .then(unsub => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, accountSelected]);
  

  const onChange = address => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
        <Menu.Menu position='right' style={{ alignItems: 'center' }}>
          { !accountSelected
            ? <span>
              Add your account with the{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/polkadot-js/extension'
              >
                Polkadot JS Extension
              </a>
            </span>
            : null }
          <CopyToClipboard text={accountSelected}>
            <Button
              basic
              circular
              size='large'
              icon='user'
              color={accountSelected ? 'green' : 'red'}
            />
          </CopyToClipboard>
          <Dropdown
            search
            selection
            clearable
            placeholder='Select an account'
            options={keyringOptions}
            onChange={(_, dropdown) => {
              onChange(dropdown.value);
            }}
            value={accountSelected}
          />
          <BalanceAnnotation accountSelected={accountSelected} accountBalance={accountBalance}/>
        </Menu.Menu>
    </ div >
  );
}

function BalanceAnnotation (props) {
  const { accountSelected, accountBalance } = props;

  return accountSelected
    ? <Label pointing='left'>
        <Icon name='money' color='green' />
        {accountBalance}
      </Label>
    : null;
}

export default function AccountSelector (props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}
