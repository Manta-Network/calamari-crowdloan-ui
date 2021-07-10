import React, { useState, useEffect, createRef } from 'react';
import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
  Button,
  Input
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from 'pages/HomePage';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';
import getFromAccount from './utils/GetFromAccount';
import { makeDefaultTxResHandler } from './utils/MakeTxResHandler';

import AccountSelector from './AccountSelector';
import KusamaToAtomicUnits from './utils/KusamaToAtomicUnits';
import { BN } from '@polkadot/util';
import TxStatusDisplay from './TxStatusDisplay';
import { decodeAddress } from '@polkadot/util-crypto';

const Main = () => {
  const [accountAddress, setAccountAddress] = useState();
  const [fromAccount, setFromAccount] = useState();
  const [status, setStatus] = useState();
  const [, setUnsub] = useState();
  const [contributeAmount, setContributeAmount] = useState(new BN(-1));
  const [referrer, setReferrer] = useState(null);
  const { apiState, api, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const PARA_ID = 2000;

  console.log(
    'decodeAddress',
    decodeAddress('5FBp8JTjQM3Hv3uqTQz5grhPCqJKZ1KF9Ckq8sZCHFtTNg7f'),
    decodeAddress('FhRncoc2i4DfhjHE7o8ap4PMRaZMg8RbabaXXq9m46x7d9e')
  );

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

  const loader = (text) => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  );

  const message = (err) => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Substrate"
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>
  );

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)",
    );
  }

  const extrinsicSucceeded = (extrinsic, blockHash) => true;

  const getRemarks = async (address, blockHash) => {
    const signedBlock = await api.rpc.chain.getBlock(blockHash);
    signedBlock.block.extrinsics
      .filter((extrinsic) => address.includes(extrinsic.signer.toString()))
      .filter(
        (extrinsic) =>
          extrinsic.method._meta.name.toString() === 'remarkWithEvent' ||
          extrinsic.method._meta.name.toString() === 'remark_with_event',
      )
      .filter((extrinsic) => extrinsicSucceeded(extrinsic, blockHash))
      // .map(extrinsic => new MintData(extrinsic.method.args[0]))
      .forEach((extrinsic) => {
        console.log(extrinsic, extrinsic.signer.toHuman(), 'remark!');
      });
  };

  getRemarks(
    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    '0x45367a39d1faaa86368a735c5bd2fee3f381d6ae44e9021ce45578e179549e1a',
  );

  const contextRef = createRef();

  const createReferrerRemark = ({ paraId, api, referrer }) => {
    const refAcc = api.createType('AccountId', referrer);
    const remark = api.createType('CalamariCrowdloanReferrerRemark', {
      magic: 'CA',
      paraId,
      referrer: refAcc,
      referrerHash: refAcc.hash.toHex(),
    });
    return api.createType('Bytes', remark.toHex());
  };

  const getTotalCrowdloanFunds = async () => {
    const res = await api.query.crowdloan.funds(PARA_ID);
    return res.isSome ? res.value.raised.toHuman() : null;
  };

  const getBalance = async (address) => {
    const { data: balance } = await api.query.system.account(address);
    return balance;
  };

  const contribute = () => {
    const handleTxResponse = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx.crowdloan.contribute(
      2000,
      KusamaToAtomicUnits(1, api),
      null,
    );
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const publishReferral = () => {
    const handleTxResponse = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx.system.remarkWithEvent(
      createReferrerRemark({ PARA_ID, api, referrer }),
    );
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const onChangeContributeAmount = (e) => {
    if (e.target.value) {
      setContributeAmount(new BN(e.target.value));
    } else {
      setContributeAmount(new BN(-1));
    }
  };

  const onChangeReferrer = (e) => {
    if (e.target.value) {
      setReferrer(e.target.value);
    } else {
      setReferrer(null);
    }
  };

  const contributeButtonIsDisabled =
    !contributeAmount || contributeAmount.lte(new BN(0));
  const contributeFormIsDisabled = status && status.isProcessing();

  const referralButtonIsDisabled = !referrer;
  const referralInputIsDisabled = status && status.isProcessing();

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} />
      </Sticky>
      <Container>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <Input
              label="Amount"
              type="number"
              state="contributeAmount"
              disabled={contributeFormIsDisabled}
              onChange={onChangeContributeAmount}
            />
          </Grid.Row>
          <Grid.Row stretched>
            <Button disabled={contributeButtonIsDisabled} onClick={contribute}>
              Contribute
            </Button>
          </Grid.Row>
          <Grid.Row stretched>
            <Input
              label="Referrer"
              type="string"
              state="referrer"
              disabled={referralInputIsDisabled}
              onChange={onChangeReferrer}
            />
          </Grid.Row>
          <Grid.Row stretched>
            <Button
              disabled={referralButtonIsDisabled}
              onClick={publishReferral}>
              Set
            </Button>
          </Grid.Row>
        </Grid>
        <Grid.Row stretched>
          <TxStatusDisplay txStatus={status} />
        </Grid.Row>
      </Container>
      <DeveloperConsole />
    </div>
  );
}

export default function App() {
  return (
    <SubstrateContextProvider>
      <Router>
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/app" component={Main} exact />
        </Switch>
      </Router>
    </SubstrateContextProvider>
  );
}
