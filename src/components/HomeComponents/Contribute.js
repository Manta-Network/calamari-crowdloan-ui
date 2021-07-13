import React, { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { useSubstrate } from '../../substrate-lib';
import { KusamaToAtomicUnits, KusamaFromAtomicUnits } from '../../utils/KusamaToAtomicUnits'
import Decimal from 'decimal.js';
import { PARA_ID } from '../../constants/ChainConstants'
import { makeDefaultTxResHandler } from '../../utils/MakeTxResHandler'

function Contribute({ fromAccount, accountBalance }) {
  Decimal.set({ precision: 50, defaults: true })

  const [status, setStatus] = useState(null)
  const [, setUnsub] = useState(null)
  const [contributeAmountInput, setContributeAmountInput] = useState(null)
  const [referralCode, setReferralCode] = useState()
  const [totalFundsRaisedKSM, setTotalFundsRaisedKSM] = useState(null)
  // 2084
  const { api } = useSubstrate();


  useEffect(() => {
    let unsubscribe;
    // If the user has selected an address, create a new subscription
    api.query.crowdloan.funds(PARA_ID, funds => {
      const totalFundsRaisedAtomicUnits = funds.isSome ? new Decimal(funds.value.raised.toString()) : new Decimal(0)
      setTotalFundsRaisedKSM(KusamaFromAtomicUnits(totalFundsRaisedAtomicUnits, api))
    })
      .then(unsub => {
        unsubscribe = unsub;
      })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api]);

  const getContributeAmountKSM = () => {
    try {
      return new Decimal(contributeAmountInput)
    } catch (error) {
      return null
    }
  }
  const contributeAmountKSM = getContributeAmountKSM()

  const getContributeAmountAtomicUnits = () => {
    try {
      return KusamaToAtomicUnits(new Decimal(contributeAmountInput), api)
    } catch (error) {
      return null
    }
  }
  const contributeAmountAtomicUnits = getContributeAmountAtomicUnits()

  const getEarlyBonus = () => {
    if (!totalFundsRaisedKSM || !contributeAmountKSM) {
      console.log('suffer')
      return null
    }
    console.log()
    const KSMEligibleForBonus = new Decimal(1000)
    const KSMEligibleForBonusRemaining = Decimal.max(0, KSMEligibleForBonus.minus(totalFundsRaisedKSM))
    const userKSMIneligibleForBonus = Decimal.max(0, contributeAmountKSM.minus(KSMEligibleForBonusRemaining))
    const userKSMEligibleForBonus = contributeAmountKSM.minus(userKSMIneligibleForBonus)
    return userKSMEligibleForBonus.mul(new Decimal(500))
  }
  const earlyBonus = getEarlyBonus()

  const getReferalBonus = () => {
    if (!contributeAmountKSM) return null
    return referralCode ? contributeAmountKSM.mul(new Decimal(500)) : new Decimal(0)
  }
  const referralBonus = getReferalBonus()

  const getBaseReward = () => {
    return contributeAmountKSM ? contributeAmountKSM.mul(new Decimal(10000)) : null
  }
  const baseReward = getBaseReward()

  let totalReward = null
  
  if (baseReward && referralBonus && earlyBonus) {
    totalReward = baseReward.add(referralBonus.add(earlyBonus))
  }

  const contribute = () => {
    const handleTxResponse = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx.crowdloan.contribute(
      PARA_ID,
      contributeAmountAtomicUnits,
      null,
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
      referrerHash: refAcc.hash.toHex(),
    });
    return api.createType('Bytes', remark.toHex());
  };

  const publishReferral = () => {
    const handleTxResponse = makeDefaultTxResHandler(api, setStatus);
    const tx = api.tx.system.remarkWithEvent(
      createReferrerRemark({ PARA_ID, api, referralCode }),
    );
    const unsub = tx.signAndSend(fromAccount, handleTxResponse);
    setUnsub(() => unsub);
  };

  const onClickMax = () => {
    setContributeAmountInput(accountBalance.toString())
  }

  const onChangeContributeAmountInput = e => {
    let input = e.target.value
    if (isNaN(input) && input !== '') {
      return
    }
    setContributeAmountInput(input);
  }

  const onClickClaimButton = () => {
    console.log(1)
    publishReferral()
    console.log(2)
    contribute()
    console.log(3)
  }




  return (
    <div className="content-item contribute flex-1">
      <h1 className="title">Contribute</h1>
      <p className="mb-1">Enter Your Contribution Amount</p>
      <div className="flex items-center">
        <div className="w-full form-input amount relative h-18">
          <Input
            className="w-full h-full outline-none"
            // state={contributeAmount && contributeAmount.toString()}
            value={contributeAmountInput && contributeAmountInput.toString()}
            type='numher'
            onChange={onChangeContributeAmountInput}
          />
          <span onClick={onClickMax} className="uppercase cursor-pointer text-3xl mt-2 right-0 mr-2 max-btn font-semibold absolute px-5 py-3 rounded-md">
            max
          </span>
        </div>
        <span className="text-4xl font-semibold pl-4">KSM</span>
      </div>
      <div className="pt-8">
        <p className="mb-1">Enter Your Referral Code (Optional)</p>
        <div className="w-full form-input relative h-18">
          <Input
            value={referralCode}
            onChange={e => setReferralCode(e.target.value)}
            className="w-full h-full outline-none"
          />
        </div>
      </div>
      <div className="pt-8">
        <p className="mb-1">Reward Calculator</p>
        <div className="reward">
          <div className="artibute rounded-t-lg calamari-text bg-white">
            <div className="flex text-lg justify-between px-6 pt-4 pb-2">
              <span>Base</span>
              <span className="font-semibold">{baseReward && baseReward.toString()} KMA</span>
            </div>
            <div className="flex text-lg justify-between px-6 py-2 bg-gray">
              <div>
                <span>Bonus</span>
                <span className="text-sm px-4 text-white rounded-sm ml-2 bg-red py-2">
                  Limited Time
                </span>
              </div>
              <span className="font-semibold">{earlyBonus && earlyBonus.toString()} KMA</span>
            </div>
            <div className="flex text-lg justify-between px-6 pt-2 pb-4">
              <span>Referral</span>
              <span className="font-semibold">{referralBonus && referralBonus.toString()} KMA</span>
            </div>
          </div>
          <div className="flex text-3xl p-6 result justify-between text-white">
            <span>Rewards:</span>
            <span>{totalReward && totalReward.toString()} KMA</span>
          </div>
        </div>
      </div>
      <div
        onClick={onClickClaimButton} 
        className="py-6 rounded-lg text-4xl cursor-pointer text-center mt-8 mb-4 bg-oriange">
        Claim Your KMA
      </div>
    </div>
  );
};

export default Contribute;
