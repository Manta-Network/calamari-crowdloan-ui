import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { useSubstrate } from '../../substrate-lib';
import Decimal from 'decimal.js';
import { PARA_ID } from '../../constants/ChainConstants';
import { makeTxResHandler } from '../../utils/MakeTxResHandler';
import Kusama from '../../types/Kusama';
import config from '../../config'
import TxStatusDisplay from '../../TxStatusDisplay';
import TxStatus from '../../utils/TxStatus';
import { decodeAddress } from '@polkadot/util-crypto'
import formatPayloadForSubstrate from 'utils/FormatPayloadForSubstrate';
import BN from 'bn.js'
import { hexToU8a, isHex, stringToU8a } from '@polkadot/util';



function Contribute ({ fromAccount, accountBalanceKSM, totalFundsRaisedKSM, userContributions }) {
  const [referralStatus, setReferralStatus] = useState(null);
  const [contributionStatus, setContributionStatus] = useState(null)
  const [, setUnsub] = useState(null);
  const [contributeAmountInput, setContributeAmountInput] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState();
  const [referralCode, setReferralCode] = useState()

  const { api } = useSubstrate();

  const getContributeAmounKSM = () => {
    try {
      return new Kusama(Kusama.KSM, new Decimal(contributeAmountInput));
    } catch (error) {
      return new Kusama(Kusama.KSM, new Decimal(0));
    }
  };
  const contributeAmountKSM = getContributeAmounKSM();
  const contributeAmountAtomicUnits = contributeAmountKSM.toAtomicUnits();

  // console.log(referralCode && hexToU8a('0x' + Buffer.from(referralCode).toString('hex'))


  const getEarlyBonus = () => {
    if (!totalFundsRaisedKSM || !contributeAmountKSM) {
      return null;
    }
    const KSMEligibleForBonus = new Kusama(Kusama.KSM, new Decimal(1000));
    const KSMEligibleForBonusRemaining = KSMEligibleForBonus.minus(totalFundsRaisedKSM).max(new Kusama(Kusama.KSM, new Decimal(0)));
    const userKSMIneligibleForBonus = contributeAmountKSM.minus(KSMEligibleForBonusRemaining).max(new Kusama(Kusama.KSM, new Decimal(0)));
    const userKSMEligibleForBonus = contributeAmountKSM.minus(userKSMIneligibleForBonus);
    return userKSMEligibleForBonus.value.mul(new Decimal(500));
  };
  const earlyBonus = getEarlyBonus();

  const getReferalBonus = () => {
    if (!contributeAmountKSM) return null;
    return referralCodeInput ? contributeAmountKSM.value.mul(new Decimal(500)) : new Decimal(0);
  };
  const referralBonus = getReferalBonus();

  const getBaseReward = () => {
    if (!contributeAmountKSM) return null;
    return contributeAmountKSM ? contributeAmountKSM.value.mul(new Decimal(10000)) : new Decimal(0);
  };
  const baseReward = getBaseReward();

  let totalReward = null;

  if (baseReward && referralBonus && earlyBonus) {
    totalReward = baseReward.add(referralBonus.add(earlyBonus));
  }

  const contribute = () => {
    const handleTxResponse = makeTxResHandler(
      api, onContributeSuccess, onContributeFailure, onContributeUpdate);
    console.log('suffer', formatPayloadForSubstrate([
      2055,
      contributeAmountAtomicUnits.value.toString(),
      null
    ]))
    const tx = api.tx.crowdloan.contribute(
      ...formatPayloadForSubstrate([
        2055,
        new BN(contributeAmountAtomicUnits.value.toString()),
        null
      ])
    );
    // console.log('fromAccount', fromAccount)
    tx.signAndSend(fromAccount, handleTxResponse);
  };

  const onContributeSuccess = block => {
    setContributionStatus(TxStatus.finalized(block));
    publishReferral()
  }
  const onContributeFailure = (block, error) => {
    setContributionStatus(TxStatus.failed(block, error));
  }
  const onContributeUpdate = message => {
    console.log(message)

    setContributionStatus(TxStatus.processing(message));
  }

  const onReferralSuccess = block => {
    setContributionStatus(TxStatus.finalized(block));
  }
  const onReferralFailure = (block, error) => {
    setContributionStatus(TxStatus.failed(block, error));
  }
  const onReferralUpdate = message => {
    console.log(message)
    setContributionStatus(TxStatus.processing(message));
  }

  const publishReferral = () => {
    const memo = api.createType('Memo', referralCode);
    const handleTxResponse = makeTxResHandler(
      api, onReferralSuccess, onReferralFailure, onReferralUpdate);
    const tx = api.tx.crowdloan.addMemo(
      2055, memo.toHex()
    );
    console.log(tx)
    tx.signAndSend(fromAccount, handleTxResponse);
  };

  const onClickMax = () => {
    console.log(accountBalanceKSM?.toString(), 'accountbalance')
    accountBalanceKSM && setContributeAmountInput(accountBalanceKSM.toString(false));
  };

  const onChangeContributeAmountInput = e => {
    const input = e.target.value;
    if (isNaN(input) && input !== '') {
      return;
    }
    setContributeAmountInput(input);
  };

  const onChangeReferralCodeInput = e => {
    setReferralCodeInput(e.target.value)
    try {
      const referralCode = decodeAddress(e.target.value)
      setReferralCode(referralCode)
    } catch (error) {
      setReferralCode(null)
    }
  }

  const onClickClaimButton = () => {
    publishReferral();
  };

  return (
    <div className="content-item p-8 xl:p-10 h-full contribute flex-1">
      <h1 className="title text-3xl md:text-4xl">Contribute</h1>
      <p className="mb-2 text-sm xl:text-base">Enter Your Contribution Amount</p>
      <div className="flex items-center">
        <div className="form-input w-4/5 amount relative h-20">
          <Input
            className="h-full w-full outline-none"
            value={contributeAmountInput && contributeAmountInput.toString()}
            type='numher'
            onChange={onChangeContributeAmountInput}
          />
          <span onClick={onClickMax} className="uppercase cursor-pointer text-xl xl:text-2xl mt-4 right-0 mr-4 max-btn font-semibold absolute px-5 py-3 rounded-md">
            max
          </span>
        </div>
        <div className="text-2xl xl:text-2xl w-1/5 font-semibold pl-4">KSM</div>
      </div>
      <div className="pt-8">
        <p className="mb-2 text-sm xl:text-base">Enter Your Referral Code (Optional)</p>
        <div className="w-full form-input relative h-20">
          <Input
            value={referralCodeInput}
            onChange={onChangeReferralCodeInput}
            className="w-full h-full outline-none"
          />
        </div>
      </div>
      <div className="pt-8">
        <p className="mb-2">Your Rewards</p>
        <div className="reward">
          <div className="artibute rounded-t-lg calamari-text bg-white">
            <div className="flex text-base xl:text-lg justify-between px-3 xl:px-6 pt-4 pb-2">
              <span>Base</span>
              <span className="font-semibold">{baseReward && baseReward.toString()} KMA</span>
            </div>
            <div className="flex text-base xl:text-lg items-center justify-between px-3 xl:px-6 py-2 bg-gray">
              <div className="flex items-center">
                <span>Bonus</span>
                <span className="text-xs block text-white rounded-sm ml-2 bg-red py-1 px-2">
                  Limited Time
                </span>
              </div>
              <span className="font-semibold">{earlyBonus && earlyBonus.toString()} KMA</span>
            </div>
            <div className="flex text-base xl:text-lg justify-between px-3 xl:px-6 pt-2 pb-4">
              <span>Referral</span>
              <span className="font-semibold">{referralBonus && referralBonus.toString()} KMA</span>
            </div>
          </div>
          <div className="flex text-2xl xl:text-2xl p-6 result justify-between text-white">
            <span>Rewards:</span>
            <span>{totalReward && totalReward.toString()} KMA</span>
          </div>
        </div>
      </div>
      <div
        onClick={onClickClaimButton}
        className="py-6 rounded-lg text-3xl xl:text-3xl cursor-pointer text-center mt-8 mb-4 bg-oriange">
        Claim Your KMA
      </div>
      <TxStatusDisplay txStatus={contributionStatus} />
      <TxStatusDisplay txStatus={referralStatus} />
    </div>
  );
}

export default Contribute;
