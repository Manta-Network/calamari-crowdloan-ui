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
import { isHex, hexAddPrefix } from '@polkadot/util';
import ReferralCode from 'types/ReferralCode';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage () {
  axios.defaults.baseURL = config.SUBSCAN_URL;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;
  axios.defaults.headers.post['X-API-Key'] = config.API_KEY;
  axiosRetry(axios, { retries: 5, retryDelay: _ => 1000, retryCondition: error => error.response.status === 429 });

  const { referralCode } = useParams();
  const { t } = useTranslation();

  const [fromAccount, setFromAccount] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountBalanceKSM, setAccountBalanceKSM] = useState(null);
  const [userContributions, setUserContributions] = useState(null);

  const [totalContributionsKSM, setTotalContributionsKSM] = useState(null);
  const [allReferrals, setAllReferrals] = useState(null);
  const [allContributions, setAllContributions] = useState(null);
  const [allContributors, setAllContributors] = useState(null);
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
    const getAllContributors = allContributions => {
      return allContributions
        .map(contribution => contribution.address)
        .filter((address, i, self) => self.indexOf(address) === i);
    };

    const getAllContributionsAndReferrals = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      let totalPages;
      let pageIdx = 0;
      const allContributions = [];
      const allReferrals = {};

      do {
        const res = await axios.post('parachain/contributes', { order: 'block_num asc', fund_id: config.FUND_ID, row: 100, page: pageIdx, from_history: true });
        totalPages = Math.floor(res.data.data.count / 100);
        res.data.data.contributes?.forEach(contribution => {
          const amountKSM = new Kusama(Kusama.ATOMIC_UNITS, new Decimal(contribution.contributing)).toKSM();
          const referralCode = (isHex(hexAddPrefix(contribution.memo)) && contribution.memo.length === 64) ? ReferralCode.fromHexStr(contribution.memo) : null;
          const currentContribution = new Contribution(amountKSM, new Date(contribution.block_timestamp * 1000), contribution.who, referralCode);
          allContributions.push(currentContribution);
          if (referralCode) {
            allReferrals[contribution.who] = referralCode.toAddress();
          }
        });
        pageIdx++;
      } while (pageIdx < totalPages);
      const allContributors = getAllContributors(allContributions);
      setAllContributors(allContributors);
      setAllContributions(allContributions);
      setAllReferrals(allReferrals);
    };
    getAllContributionsAndReferrals();
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
    const getTotalContributionsKSM = async () => {
      const res = await axios.post('parachain/funds', { fund_id: config.FUND_ID, row: 1, page: 0 });
      setTotalContributionsKSM(new Kusama(Kusama.ATOMIC_UNITS, new Decimal(res.data.data.funds[0].raised)).toKSM());
    };
    getTotalContributionsKSM();
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
  else if (apiState !== 'READY') return loader(t('Connecting to Kusama'));

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review polkadot.js authorization)');
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
                accountAddress={accountAddress}
                allContributors={allContributors}
                urlReferralCode={referralCode}
                fromAccount={fromAccount}
                accountBalanceKSM={accountBalanceKSM}
                totalContributionsKSM={totalContributionsKSM}
                setUserContributions={setUserContributions}
              />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Details
                accountAddress={accountAddress}
                userContributions={userContributions}
                allContributions={allContributions}
                allContributors={allContributors}
                allReferrals={allReferrals}
              />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Crowdloan
                totalContributionsKSM={totalContributionsKSM}
                allContributions={allContributions}
                allContributors={allContributors}
                allReferrals={allReferrals}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <ContributeActivity allContributions={allContributions} />
    </div>
  );
}

export default HomePage;
