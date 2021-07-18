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
import Persistence from '../../utils/Persistence';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import config from 'config';

function HomePage() {
  axios.defaults.baseURL = config.SUBSCAN_URL;
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = true;
  axiosRetry(axios, { retries: 5, retryDelay: _ => 1000, retryCondition: error => error.response.status === 429 });

  const [accountAddress, setAccountAddress] = useState();
  const [accountBalanceKSM, setAccountBalanceKSM] = useState();
  const [userContributions, setUserContributions] = useState([]);
  const [userReferrals, setUserReferrals] = useState([]);
  const [userRewards, setUserRewards] = useState(0);
  const [fromAccount, setFromAccount] = useState(null);
  const [totalFundsRaisedKSM, setTotalFundsRaisedKSM] = useState(new Kusama(Kusama.KSM, new Decimal(0)));
  const { api, apiState, keyring, keyringState, apiError } = useSubstrate();
  const [dayBlocks, setDayBlocks] = useState();
  const [contributionsByDay, setContributionsByDay] = useState();

  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  // todo: handle failed extrinsics (subscan)

  // Get my contributions
  useMemo(() => {
    const getUserContributions = async () => {
      if (!accountAddress || !api) {
        return;
      }
      await api.isReady;
      const res = await axios.post('extrinsics', { call: 'contribute', address: accountAddress, module: 'crowdloan', row: 100, page: 0 });
      const contributions = await Promise.all(res.data.data.extrinsics
        .filter(ex => ex.success)
        .map(ex => ({ timestamp: ex.block_timestamp, blockNumber: ex.block_num, extrinsicIndex: parseInt(ex.extrinsic_index.split('-')[1]) }))
        .map(async ex => {
          const blockHash = await api.rpc.chain.getBlockHash(ex.blockNumber);
          const signedBlock = await api.rpc.chain.getBlock(blockHash);
          const amountKSM = new Kusama(
            Kusama.ATOMIC_UNITS,
            new Decimal(signedBlock.block.extrinsics[ex.extrinsicIndex].method.args[1].toNumber())
          ).toKSM();
          return new Contribution(amountKSM, new Date(ex.timestamp));
        }));
      setUserContributions(contributions);
    };
    getUserContributions();
  }, [accountAddress, api]);

  const getCurrentDatetime = () => {
    return new Date()
  }

  useMemo(() => {
    const binarySearch = async (firstBlockNumber, lastBlockNumber, targetTimestamp, api) => {
      let midpointBlockNumber;
      while (lastBlockNumber > firstBlockNumber) {
        midpointBlockNumber = Math.ceil((firstBlockNumber + lastBlockNumber) / 2);
        const midpointBlockHash = await api.rpc.chain.getBlockHash(midpointBlockNumber);
        const midpointBlock = await api.rpc.chain.getBlock(midpointBlockHash);
        const midpointBlockTimestampRaw = await api.query.timestamp.now.at(midpointBlock.block.header.parentHash);
        const midpointBlockTimestamp = new Date(Number.parseInt(midpointBlockTimestampRaw.toString()));
        if (midpointBlockTimestamp < targetTimestamp) {
          firstBlockNumber = midpointBlockNumber + 1;
        } else if (midpointBlockTimestamp > targetTimestamp) {
          lastBlockNumber = midpointBlockNumber - 1;
        } else {
          break;
        }
      }
      return midpointBlockNumber;
    };
    // Get the block numbers that mark the [1st, 2nd...nth] day of the crowdloan
    // These are used to populate the line graph--they tell us the ranges of blocks correspond to points on the graph
    const getDayBlocks = async () => {
      if (!api) {
        return;
      }
      await api.isReady;
      const APPROX_BLOCKS_PER_DAY = 14300;
      const lastBlock = await api.rpc.chain.getBlock();
      const lastBlockNumber = lastBlock.block.header.number.toNumber();
      const firstBlockNumber = 0;
      const CROWDLOAN_START_DATE = new Date(config.CROWDLOAN_START_TIMESTAMP);
      const crowdloanStartBlock = await binarySearch(firstBlockNumber, lastBlockNumber, CROWDLOAN_START_DATE, api); // todo: hardcode for production
      const msIntoCrowdloan = new Date() - CROWDLOAN_START_DATE;
      const daysIntoCrowdloan = Math.ceil(msIntoCrowdloan / (1000 * 60 * 60 * 24));
      console.log(daysIntoCrowdloan)
      setDayBlocks([...Array(daysIntoCrowdloan).keys()]
        .map(daysIntoCrowdloan => crowdloanStartBlock + APPROX_BLOCKS_PER_DAY * daysIntoCrowdloan));
    };
    getDayBlocks();
  }, [api]);









  useMemo(() => {
    const getContributionsByDay = async () => {
      if (!dayBlocks || !api) {
        return;
      }
      await api.isReady;
      const contributionsByDay = [new Kusama(Kusama.KSM, new Decimal(0))];
      let selectedDayIndex = 1;
      let selectedDayEndBlockNumber = dayBlocks[selectedDayIndex];
      let contributionsProcessed = 0;
      let pageNumber = 0;
      let totalContributions;

      do {
        const res = await axios.post('parachain/contributes', { order: 'block_num asc', fund_id: config.FUND_ID, row: 100, page: pageNumber, from_history: true });
        totalContributions = res.data.data.count;
        if (!res.data.data.contributes) {
          break;
        }
        res.data.data.contributes.forEach(contribution => {
          console.log(contribution)
          const amountKSM = new Kusama(Kusama.ATOMIC_UNITS, new Decimal(contribution.contributing)).toKSM();
          while (contribution.block_num >= selectedDayEndBlockNumber) {
            selectedDayIndex++;
            selectedDayEndBlockNumber = dayBlocks[selectedDayIndex];
            contributionsByDay.push(new Kusama(Kusama.KSM, new Decimal(0)));
          }
          const currentDayContribution = contributionsByDay[contributionsByDay.length - 1];
          contributionsByDay[contributionsByDay.length - 1] = currentDayContribution.add(amountKSM);
          contributionsProcessed++;
        });
        pageNumber++;
      } while (totalContributions > contributionsProcessed);

      while (contributionsByDay.length < dayBlocks.length - 1) {
        contributionsByDay.push(new Kusama(Kusama.KSM, new Decimal(0)));
      }
      setContributionsByDay(contributionsByDay);
    };
    getContributionsByDay();
  }, [dayBlocks, api]);











  useEffect(() => {
    async function loadFromAccount(accountPair) {
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
              <Details userContributions={userContributions} />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Crowdloan totalFundsRaisedKSM={totalFundsRaisedKSM} contributionsByDay={contributionsByDay} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <ContributeActivity />
    </div>
  );
}

export default HomePage;
