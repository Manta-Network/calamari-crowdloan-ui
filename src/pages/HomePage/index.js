import React, { useState, useEffect, useMemo } from 'react';
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
import Decimal from 'decimal.js';
import Kusama from 'types/Kusama';
import Contribution from 'types/Contribution';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import config from 'config';
import { encodeAddress } from '@polkadot/util-crypto';

function HomePage () {
  axios.defaults.baseURL = config.SUBSCAN_URL;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;
  axios.defaults.headers.post['X-API-Key'] = config.API_KEY;
  axiosRetry(axios, { retries: 5, retryDelay: _ => 1000, retryCondition: error => error.response.status === 429 });

  const [fromAccount, setFromAccount] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountBalanceKSM, setAccountBalanceKSM] = useState(null);
  const [userContributions, setUserContributions] = useState(null);

  const [totalFundsRaisedKSM, setTotalFundsRaisedKSM] = useState(null);
  const [allReferrals, setAllReferrals] = useState({});
  const [allContributions, setAllContributions] = useState(null);
  const { api, apiState, keyring, keyringState, apiError } = useSubstrate();

  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  useMemo(() => {
    const getUserContributions = async () => {
      if (!accountAddress || !api) {
        return;
      }
      await api.isReady;
      const res = await axios.post('extrinsics', { call: 'contribute', address: accountAddress, module: 'crowdloan', row: 100, page: 0 });
      const extrinsics = res.data.data.extrinsics || [];
      let contributions = await Promise.all(extrinsics
        .filter(ex => ex.success)
        .map(ex => {
          return { timestamp: ex.block_timestamp * 1000, blockNumber: ex.block_num, extrinsicIndex: parseInt(ex.extrinsic_index.split('-')[1]) };
        })
        .map(async ex => {
          const blockHash = await api.rpc.chain.getBlockHash(ex.blockNumber);
          const signedBlock = await api.rpc.chain.getBlock(blockHash);
          const paraID = signedBlock.block.extrinsics[ex.extrinsicIndex].method.args[0].toNumber();
          if (paraID && ex.timestamp > config.CROWDLOAN_START_TIMESTAMP) {
            const amountKSM = new Kusama(
              Kusama.ATOMIC_UNITS,
              new Decimal(signedBlock.block.extrinsics[ex.extrinsicIndex].method.args[1].toNumber())
            ).toKSM();
            return new Contribution(amountKSM, new Date(ex.timestamp), accountAddress);
          }
        })
      );
      contributions = contributions.filter(contribution => contribution !== undefined);
      setUserContributions(contributions);
    };
    getUserContributions();
  }, [accountAddress, api]);

  useMemo(() => {
    const getAllContributions = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      let totalPages;
      let pageIdx = 0;
      const allContributions = [];
      do {
        const res = await axios.post('parachain/contributes', { order: 'block_num asc', fund_id: config.FUND_ID, row: 100, page: pageIdx, from_history: true });
        totalPages = Math.floor(res.data.data.count / 100);
        res.data.data.contributes
          ?.filter(contribution => contribution.fund_id === config.FUND_ID)
          .forEach(contribution => {
            const amountKSM = new Kusama(Kusama.ATOMIC_UNITS, new Decimal(contribution.contributing)).toKSM();
            const currentContribution = new Contribution(amountKSM, new Date(contribution.block_timestamp), contribution.who);
            allContributions.push(currentContribution);
          });
        pageIdx++;
      } while (pageIdx < totalPages);
      setAllContributions(allContributions);
    };
    getAllContributions();
  }, [api]);

  useMemo(() => {
    const getAllReferrals = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      // todo: loop over every page
      const res = await axios.post('extrinsics', { call: 'add_memo', module: 'crowdloan', row: 100, page: 0 });
      const extrinsics = res.data.data.extrinsics || [];
      const referrals = {};
      // todo: check that referrals are for OUR crowdloan
      await Promise.all(extrinsics
        .filter(ex => ex.success)
        .map(ex => ({ timestamp: ex.block_timestamp * 1000, blockNumber: ex.block_num, extrinsicIndex: parseInt(ex.extrinsic_index.split('-')[1]) }))
        .map(async ex => {
          const blockHash = await api.rpc.chain.getBlockHash(ex.blockNumber);
          const signedBlock = await api.rpc.chain.getBlock(blockHash);
          const paraID = signedBlock.block.extrinsics[ex.extrinsicIndex].method.args[0].toNumber();
          const memoBytes = signedBlock.block.extrinsics[ex.extrinsicIndex].method.args[1];
          const referredAddress = signedBlock.block.extrinsics[ex.extrinsicIndex].signer.toString();
          if (memoBytes.length === 32 && paraID === config.PARA_ID && ex.timestamp > config.CROWDLOAN_START_TIMESTAMP) {
            const referrerAddress = encodeAddress(memoBytes, 42);
            referrals[referredAddress] = referrerAddress;
          }
        }));
      setAllReferrals(referrals);
    };
    getAllReferrals();
  }, [api]);

  useEffect(() => {
    async function loadFromAccount (accountPair) {
      if (!api || !api.isConnected || !accountPair) {
        return;
      }
      await api.isReady;
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
        setAccountBalanceKSM(new Kusama(Kusama.ATOMIC_UNITS, rawBalance).toKSM());
      })
        .then(unsub => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, accountAddress]);

  useEffect(() => {
    const getTotalFundsRaisedKSM = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      const funds = await api.query.crowdloan.funds(config.PARA_ID);
      const totalFundsRaisedAtomicUnits = funds.isSome ? new Decimal(funds.value.raised.toString()) : new Decimal(0);
      setTotalFundsRaisedKSM(new Kusama(Kusama.ATOMIC_UNITS, totalFundsRaisedAtomicUnits).toKSM());
    };
    getTotalFundsRaisedKSM();
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
        accountAddress={accountAddress}
        setAccountAddress={setAccountAddress}
        accountBalanceKSM={accountBalanceKSM}
      />
      <div className="home-content py-6">
        <Grid columns="three">
          <Grid.Row className="flex-wrap flex-col flex">
            <Grid.Column className="flex-wrap item flex">
              <Contribute
                fromAccount={fromAccount}
                accountBalanceKSM={accountBalanceKSM}
                totalFundsRaisedKSM={totalFundsRaisedKSM}
                setUserContributions={setUserContributions}
              />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Details
                accountAddress={accountAddress}
                userContributions={userContributions}
                allContributions={allContributions}
                allReferrals={allReferrals}
              />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Crowdloan
                totalFundsRaisedKSM={totalFundsRaisedKSM}
                allContributions={allContributions}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <ContributeActivity />
    </div>
  );
}

export default HomePage;
