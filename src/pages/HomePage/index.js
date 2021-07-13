import React, { useState, useEffect } from 'react';
import Navbar from 'components/Layouts/Navbar';
import {
  Details,
  Contribute,
  Crowdloan,
  ContributeActivity
} from 'components/HomeComponents';
import { useSubstrate } from '../../substrate-lib';
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import getFromAccount from '../../utils/GetFromAccount'


function HomePage() {
  const [accountAddress, setAccountAddress] = useState()
  const [accountBalance, setAccountBalance] = useState()
  const [fromAccount, setFromAccount] = useState(null);
  const { api, apiState, keyring, keyringState, apiError } = useSubstrate();

  const accountPair =
  accountAddress &&
  keyringState === 'READY' &&
  keyring.getPair(accountAddress);

  useEffect(() => {
    async function loadFromAccount (accountPair) {
      if (!api || !api.isConnected || !accountPair) {
        return;
      }
      const fromAccount = await getFromAccount(accountPair, api);
      setFromAccount(fromAccount);
    }
    loadFromAccount(accountPair, api);
  }, [api, accountPair]);

  const loader = text =>
  <Dimmer active>
    <Loader size='small'>{text}</Loader>
  </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }


  return (
    <div className="home-page">
      <Navbar setAccountAddress={setAccountAddress} setAccountBalance={setAccountBalance} accountBalance={accountBalance} />
      <div className="home-content">
        <Grid columns="three">
          <Grid.Row className="flex-wrap flex">
            <Grid.Column className="flex-wrap flex">
              <Contribute fromAccount={fromAccount} accountBalance={accountBalance} />
            </Grid.Column>
            <Grid.Column className="flex-wrap flex">
              <Details />
            </Grid.Column>
            <Grid.Column className="flex-wrap flex">
              <Crowdloan />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <ContributeActivity />
    </div>
  );
};

export default HomePage;
