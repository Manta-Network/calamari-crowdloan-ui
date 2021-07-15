import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { useSubstrate } from '../../substrate-lib';
import { KusamaToAtomicUnits, KusamaFromAtomicUnits } from '../../utils/KusamaToAtomicUnits';
import Decimal from 'decimal.js';
import { PARA_ID } from '../../constants/ChainConstants';
import { makeDefaultTxResHandler } from '../../utils/MakeTxResHandler';

function Contribute ({ fromAccount, accountBalance, totalFundsRaisedKSM, userContributions }) {
  const [status, setStatus] = useState(null);
  const [, setUnsub] = useState(null);
  const [contributeAmountInput, setContributeAmountInput] = useState('');
  const [referralCode, setReferralCode] = useState();
  // 2084
  const { api } = useSubstrate();

  const getContributeAmountKSM = () => {
    try {
      return new Decimal(contributeAmountInput);
    } catch (error) {
      return null;
    }
  };
  const contributeAmountKSM = getContributeAmountKSM();

  const getContributeAmountAtomicUnits = () => {
    try {
      return KusamaToAtomicUnits(new Decimal(contributeAmountInput), api);
    } catch (error) {
      return null;
    }
  };
  const contributeAmountAtomicUnits = getContributeAmountAtomicUnits();

  const getEarlyBonus = () => {
    if (!totalFundsRaisedKSM || !contributeAmountKSM) {
      return null;
    }
    const KSMEligibleForBonus = new Decimal(1000);
    const KSMEligibleForBonusRemaining = Decimal.max(0, KSMEligibleForBonus.minus(totalFundsRaisedKSM));
    const userKSMIneligibleForBonus = Decimal.max(0, contributeAmountKSM.minus(KSMEligibleForBonusRemaining));
    const userKSMEligibleForBonus = contributeAmountKSM.minus(userKSMIneligibleForBonus);
    return userKSMEligibleForBonus.mul(new Decimal(500));
  };
  const earlyBonus = getEarlyBonus();

  const getReferalBonus = () => {
    if (!contributeAmountKSM) return null;
    return referralCode ? contributeAmountKSM.mul(new Decimal(500)) : new Decimal(0);
  };
  const referralBonus = getReferalBonus();

  const getBaseReward = () => {
    return contributeAmountKSM ? contributeAmountKSM.mul(new Decimal(10000)) : null;
  };
  const baseReward = getBaseReward();

  let totalReward = null;

  if (baseReward && referralBonus && earlyBonus) {
    totalReward = baseReward.add(referralBonus.add(earlyBonus));
  }

  const contribute = () => {
    const handleTxResponse = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx.crowdloan.contribute(
      PARA_ID,
      contributeAmountAtomicUnits,
      null
    );
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const createReferrerRemark = ({ paraId, api, referrer }) => {
    const refAcc = api.createType('AccountId', referrer);
    const remark = api.createType('CalamariCrowdloanReferrerRemark', {
      magic: 'CA',
      paraId,
      referrer: refAcc,
      referrerHash: refAcc.hash.toHex()
    });
    return api.createType('Bytes', remark.toHex());
  };

  const publishReferral = () => {
    const handleTxResponse = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx.system.remarkWithEvent(
      createReferrerRemark({ PARA_ID, api, referralCode })
    );
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const onClickMax = () => {
    accountBalance && setContributeAmountInput(accountBalance.toString());
  };

  const onChangeContributeAmountInput = e => {
    const input = e.target.value;
    if (isNaN(input) && input !== '') {
      return;
    }
    setContributeAmountInput(input);
  };

  const onClickClaimButton = () => {
    console.log(1);
    publishReferral();
    console.log(2);
    contribute();
    console.log(3);
  };

  return (
    <div className="content-item p-8 xl:p-10 h-full contribute flex-1">
      <h1 className="title text-3xl md:text-4xl">Contribute</h1>
      <p className="mb-1 text-sm xl:text-base">Enter Your Contribution Amount</p>
      <div className="flex items-center">
        <div className="form-input w-4/5 amount relative h-18">
          <Input
            className="h-full w-full outline-none"
            value={contributeAmountInput && contributeAmountInput.toString()}
            type='numher'
            onChange={onChangeContributeAmountInput}
          />
          <span onClick={onClickMax} className="uppercase cursor-pointer text-xl xl:text-2xl mt-2 right-0 mr-2 max-btn font-semibold absolute px-5 py-3 rounded-md">
            max
          </span>
        </div>
        <div className="text-2xl xl:text-2xl w-1/5 font-semibold pl-4">KSM</div>
      </div>
      <div className="pt-8">
        <p className="mb-1 text-sm xl:text-base">Enter Your Referral Code (Optional)</p>
        <div className="w-full form-input relative h-18">
          <Input
            value={referralCode}
            onChange={e => setReferralCode(e.target.value)}
            className="w-full h-full outline-none"
          />
        </div>
      </div>
      <div className="pt-8">
        <p className="mb-1">Your Rewards</p>
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
    </div>
  );
}

export default Contribute;
