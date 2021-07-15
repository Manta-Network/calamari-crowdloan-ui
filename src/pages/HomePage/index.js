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
import getFromAccount from '../../utils/GetFromAccount';
import { PARA_ID } from '../../constants/ChainConstants';
import Decimal from 'decimal.js';
import { KusamaFromAtomicUnits } from '../../utils/KusamaToAtomicUnits';
import Persistence from '../../utils/Persistence'
import axios from 'axios';
import { times } from 'lodash';

function HomePage() {
  const [accountAddress, setAccountAddress] = useState();
  const [accountBalance, setAccountBalance] = useState();
  const [userContributions, setUserContributions] = useState([]);
  const [userRewards, setUserRewards] = useState(0);
  const [fromAccount, setFromAccount] = useState(null);
  const [totalFundsRaisedKSM, setTotalFundsRaisedKSM] = useState(0);
  const { api, apiState, keyring, keyringState, apiError } = useSubstrate();


  useEffect(() => {

    const CROWDLOAN_START_DATE = new Date(2021, 6, 12)
    console.log(CROWDLOAN_START_DATE)

    const getCurrentDatetime = () => {
      return new Date()
    }

    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    const msIntoCrowdloan = getCurrentDatetime() - CROWDLOAN_START_DATE
    const fullDaysIntoCrowdloan = Math.floor(msIntoCrowdloan / (1000 * 60 * 60 * 24));
    console.log(fullDaysIntoCrowdloan.toString())


    const midnightTimestamps = []
    for (let i = 0; i < fullDaysIntoCrowdloan; i++) {
      midnightTimestamps.push(addDays(CROWDLOAN_START_DATE, i + 1))
    }

    midnightTimestamps.forEach(timestamp => console.log(timestamp.toString()))

    const binarySearch = async () => {
      if (!api) return
      await api.isReady
      let midnightBlockNumbers = []
      let lastBlock = await api.rpc.chain.getBlock();
      for (let i = 0; i < midnightTimestamps.length; i++) {
        let lastBlockNumber = lastBlock.block.header.number.toNumber()
        let firstBlockNumber = 0
        if (midnightBlockNumbers.length > 0) {
          firstBlockNumber = midnightBlockNumbers[midnightBlockNumbers.length - 1]
        }
        let targetTimestamp = midnightTimestamps[i]
        let midpointBlockNumber;
        while (lastBlockNumber > firstBlockNumber) {
          midpointBlockNumber = Math.ceil((firstBlockNumber + lastBlockNumber) / 2)
          let midpointBlockHash = await api.rpc.chain.getBlockHash(midpointBlockNumber);
          let midpointBlock = await api.rpc.chain.getBlock(midpointBlockHash);
          let midpointBlockTimestamp = await api.query.timestamp.now.at(midpointBlock.block.header.parentHash)
          midpointBlockTimestamp = new Date(Number.parseInt(midpointBlockTimestamp.toString()))
          if (midpointBlockTimestamp < targetTimestamp) {
            firstBlockNumber = midpointBlockNumber + 1
          } else if (midpointBlockTimestamp > targetTimestamp) {
            lastBlockNumber = midpointBlockNumber - 1
          } else {
            break
          }
        }
        midnightBlockNumbers.push(midpointBlockNumber)
        console.log(midnightBlockNumbers, ':333')
      }
    }
    binarySearch()



  }, [api])



























  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  useEffect(() => {
    setUserContributions(Persistence.loadUserContributions())
  }, [])

  useEffect(() => {
    async function loadFromAccount(accountPair) {
      if (!api || !api.isConnected || !accountPair) {
        return;
      }
      const fromAccount = await getFromAccount(accountPair, api);
      setFromAccount(fromAccount);
    }
    loadFromAccount(accountPair, api);
  }, [api, accountPair]);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;
    // If the user has selected an address, create a new subscription
    accountAddress &&
      api.query.system.account(accountAddress, balance => {
        const rawBalance = new Decimal(balance.data.free.toString());
        setAccountBalance(KusamaFromAtomicUnits(rawBalance, api).toString());
      })
        .then(unsub => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, accountAddress]);

  useEffect(() => {
    if (!api) {
      return;
    }
    let unsubscribe;
    api.isReady.then(api => {
      // If the user has selected an address, create a new subscription
      api.query.crowdloan.funds(PARA_ID, funds => {
        const totalFundsRaisedAtomicUnits = funds.isSome ? new Decimal(funds.value.raised.toString()) : new Decimal(0);
        setTotalFundsRaisedKSM(KusamaFromAtomicUnits(totalFundsRaisedAtomicUnits, api));
      });
    })
      .then(unsub => {
        unsubscribe = unsub;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api]);


  useEffect(() => {

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
      <Navbar
        accountPair={accountPair}
        setAccountAddress={setAccountAddress}
        accountBalance={accountBalance}
      />
      <div className="home-content py-6">
        <Grid columns="three">
          <Grid.Row className="flex-wrap flex-col flex">
            <Grid.Column className="flex-wrap item flex">
              <Contribute
                fromAccount={fromAccount}
                accountBalance={accountBalance}
                totalFundsRaisedKSM={totalFundsRaisedKSM?.toString()}
                setUserContributions={setUserContributions}
              />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Details userContributions={userContributions} />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Crowdloan totalFundsRaisedKSM={totalFundsRaisedKSM?.toString()} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <ContributeActivity />
    </div>
  );
}

export default HomePage;
