import React, { useState, useEffect, useMemo } from 'react';
import Navbar from 'components/Layouts/Navbar';
import {
  Details,
  Contribute,
  Crowdloan,
  ContributeActivity
} from 'components/HomeComponents';
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
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
import { web3Enable } from '@polkadot/extension-dapp';
import getFromAccount from '../../utils/GetFromAccount';
import { useSubstrate, SubstrateContextProvider } from '../../substrate-lib';

function Main () {
  const { api, apiState, keyring, keyringState, apiError } = useSubstrate();

  axios.defaults.baseURL = config.SUBSCAN_URL;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;
  axios.defaults.headers.post['X-API-Key'] = config.API_KEY;
  axiosRetry(axios, { retries: 5, retryDelay: () => 600, retryCondition: error => error.response.status === 429 });

  const { referralCode } = useParams();
  const { t } = useTranslation();

  const [fromAccount, setFromAccount] = useState(null);
  const [accountAddress, setAccountAddress] = useState(null);
  const [accountBalanceKSM, setAccountBalanceKSM] = useState(null);
  const [userContributions, setUserContributions] = useState(null);
  const [polkadotJSInstalled, setPolkadotJSInstalled] = useState(null);

  const [totalContributionsKSM, setTotalContributionsKSM] = useState(null);
  const [allReferrals, setAllReferrals] = useState(null);
  const [allContributions, setAllContributions] = useState(null);
  const [allContributors, setAllContributors] = useState(null);

  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  useEffect(() => {
    console.log(`Version: ${config.GIT_HASH}`);
  });

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

  useEffect(() => {
    let unsubscribe;
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
    const checkForPolkadotJS = async () => {
      const extensions = await web3Enable(config.APP_NAME);
      setPolkadotJSInstalled(extensions.length > 0);
    };
    checkForPolkadotJS();
  }, []);

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

  useMemo(() => {
    const getUserContributions = async () => {
      if (!accountAddress || !allContributions) {
        return;
      }
      setUserContributions(
        allContributions
          .filter(contribution => contribution.address === accountAddress)
          .sort((a, b) => b.date - a.date)
      );
    };
    getUserContributions();
  }, [accountAddress, allContributions]);

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

  const walletMessage = () =>
    <Dimmer active>
      <Message compact floating >
        <a href='https://polkadot.js.org/extension/'>
          {t('Install polkadot.js wallet to continue')}
        </a>
      </Message>
    </Dimmer>;

  if (apiState === 'ERROR') {
    return message(apiError);
  } else if (keyringState === 'NO_EXTENSION') {
    return walletMessage();
  } else if (apiState !== 'READY') {
    return loader(t('Connecting to Kusama'));
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
                polkadotJSInstalled={polkadotJSInstalled}
                accountAddress={accountAddress}
                allContributors={allContributors}
                urlReferralCode={referralCode}
                fromAccount={fromAccount}
                accountBalanceKSM={accountBalanceKSM}
                totalContributionsKSM={totalContributionsKSM}
                setUserContributions={setUserContributions}
                setAccountAddress={setAccountAddress}
                accountPair={accountPair}
              />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Details
                polkadotJSInstalled={polkadotJSInstalled}
                accountAddress={accountAddress}
                userContributions={userContributions}
                allContributions={allContributions}
                allContributors={allContributors}
                allReferrals={allReferrals}
                setAccountAddress={setAccountAddress}
                accountPair={accountPair}
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

export default function HomePage () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
