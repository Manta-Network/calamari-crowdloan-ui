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
import { PARA_ID } from '../../constants/ChainConstants'
import Decimal from 'decimal.js';
import {KusamaFromAtomicUnits} from '../../utils/KusamaToAtomicUnits'

function HomePage() {
  const [accountAddress, setAccountAddress] = useState()
  const [accountBalance, setAccountBalance] = useState()
  const [fromAccount, setFromAccount] = useState(null);
  const [totalFundsRaisedKSM, setTotalFundsRaisedKSM] = useState(null)
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


  useEffect(() => {
    if (!api) {
      return;
    }
    let unsubscribe;
    api.isReady.then(api => {
      // If the user has selected an address, create a new subscription
      api.query.crowdloan.funds(PARA_ID, funds => {
        const totalFundsRaisedAtomicUnits = funds.isSome ? new Decimal(funds.value.raised.toString()) : new Decimal(0)
        setTotalFundsRaisedKSM(KusamaFromAtomicUnits(totalFundsRaisedAtomicUnits, api))
      })
    })
    .then(unsub => {
      unsubscribe = unsub;
    })
    .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api]);

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
    <div className="home-page px-6 sm:px-16 xl:px-40">
      <Navbar setAccountAddress={setAccountAddress} setAccountBalance={setAccountBalance} accountBalance={accountBalance} />
      <div className="home-content py-6">
        <Grid columns="three">
          <Grid.Row className="flex-wrap flex-col flex">
            <Grid.Column className="flex-wrap item flex">
              <Contribute fromAccount={fromAccount} accountBalance={accountBalance} totalFundsRaisedKSM={totalFundsRaisedKSM}/>
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Details />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Crowdloan totalFundsRaisedKSM={totalFundsRaisedKSM}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <ContributeActivity />
    </div>
  );
};

export default HomePage;
