/* eslint-disable multiline-ternary */
import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';
import { useSubstrate } from '../../substrate-lib';
import Decimal from 'decimal.js';
import { makeTxResHandler } from '../../utils/MakeTxResHandler';
import Kusama from '../../types/Kusama';
import TxStatusDisplay from '../../TxStatusDisplay';
import TxStatus from '../../utils/TxStatus';
import { decodeAddress } from '@polkadot/util-crypto';
import formatPayloadForSubstrate from 'utils/FormatPayloadForSubstrate';
import BN from 'bn.js';
import { useTranslation } from 'react-i18next';
import Calamari from 'types/Calamari';

function Contribute ({ fromAccount, accountBalanceKSM, totalFundsRaisedKSM, userContributions }) {
  const [referralStatus, setReferralStatus] = useState(null);
  const [contributionStatus, setContributionStatus] = useState(null);
  const [contributeAmountInput, setContributeAmountInput] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState();
  const [referralCode, setReferralCode] = useState();

  const { api } = useSubstrate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onClaimHandler = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const getContributeAmounKSM = () => {
    try {
      return new Kusama(Kusama.KSM, new Decimal(contributeAmountInput));
    } catch (error) {
      return Kusama.zero();
    }
  };
  const contributeAmountKSM = getContributeAmounKSM();
  const contributeAmountAtomicUnits = contributeAmountKSM.toAtomicUnits();

  const getEarlyBonus = () => {
    if (!totalFundsRaisedKSM || !contributeAmountKSM) {
      return null;
    }
    const KSMEligibleForBonus = new Kusama(Kusama.KSM, new Decimal(1000));
    const KSMEligibleForBonusRemaining = KSMEligibleForBonus.minus(totalFundsRaisedKSM).max(Kusama.zero());
    const userKSMIneligibleForBonus = contributeAmountKSM.minus(KSMEligibleForBonusRemaining).max(Kusama.zero());
    const userKSMEligibleForBonus = contributeAmountKSM.minus(userKSMIneligibleForBonus);
    return userKSMEligibleForBonus.toKMABonusReward();
  };
  const earlyBonus = getEarlyBonus();

  const getReferalBonus = () => {
    if (!contributeAmountKSM) return null;
    return referralCodeInput ? contributeAmountKSM.toKMAReferralReward() : Calamari.zero();
  };
  const referralBonus = getReferalBonus();

  const getBaseReward = () => {
    if (!contributeAmountKSM) return null;
    return contributeAmountKSM ? contributeAmountKSM.toKMABaseReward() : Calamari.zero();
  };
  const baseReward = getBaseReward();

  let totalReward = null;

  if (baseReward && referralBonus && earlyBonus) {
    totalReward = baseReward.add(referralBonus.add(earlyBonus));
  }

  const contribute = () => {
    const handleTxResponse = makeTxResHandler(
      api, onContributeSuccess, onContributeFailure, onContributeUpdate);
    const tx = api.tx.crowdloan.contribute(
      ...formatPayloadForSubstrate([
        2055,
        new BN(contributeAmountAtomicUnits.value.toString()),
        null
      ])
    );
    tx.signAndSend(fromAccount, handleTxResponse);
  };

  const onContributeSuccess = block => {
    setContributionStatus(TxStatus.finalized(block));
    referralCode && publishReferral();
  };
  const onContributeFailure = (block, error) => {
    setContributionStatus(TxStatus.failed(block, error));
  };
  const onContributeUpdate = message => {
    setContributionStatus(TxStatus.processing(message));
  };

  const onReferralSuccess = block => {
    setReferralStatus(TxStatus.finalized(block));
  };
  const onReferralFailure = (block, error) => {
    setReferralStatus(TxStatus.failed(block, error));
  };
  const onReferralUpdate = message => {
    setReferralStatus(TxStatus.processing(message));
  };

  const publishReferral = () => {
    const memo = api.createType('Memo', referralCode);
    const handleTxResponse = makeTxResHandler(
      api, onReferralSuccess, onReferralFailure, onReferralUpdate);
    const tx = api.tx.crowdloan.addMemo(
      2055, memo.toHex()
    );
    tx.signAndSend(fromAccount, handleTxResponse);
  };

  const onClickMax = () => {
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
    setReferralCodeInput(e.target.value);
    try {
      const referralCode = decodeAddress(e.target.value);
      setReferralCode(referralCode);
    } catch (error) {
      setReferralCode(null);
    }
  };

  const onClickClaimButton = () => {
    contribute();
  };

  // const onClaimHandler = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);
  // };

  return (
    <div className="content-item p-8 xl:p-10 h-full contribute flex-1">
      <h1 className="title text-3xl md:text-4xl">{t('Contribute')}</h1>
      <p className="mb-2 text-sm xl:text-base">
        {t('Enter your contribution amount')}
      </p>
      <div className="flex items-center">
        <div className="form-input w-4/5 amount relative h-20">
          <Input
            className="h-full w-full outline-none"
            value={contributeAmountInput && contributeAmountInput.toString()}
            type='numher'
            onChange={onChangeContributeAmountInput}
          />
          <span onClick={onClickMax} className="uppercase cursor-pointer text-xl xl:text-2xl mt-4 right-0 mr-4 max-btn font-semibold absolute px-5 py-3 rounded-md">
          {t('Max')}
          </span>
        </div>
        <div className="text-2xl xl:text-2xl w-1/5 font-semibold pl-4">KSM</div>
      </div>
      <div className="pt-8">
        <p className="mb-2 text-sm xl:text-base">
          {t('Enter your referral code (optional)')}
        </p>
        <div className="w-full form-input relative h-20">
          <Input
            value={referralCodeInput}
            onChange={onChangeReferralCodeInput}
            className="w-full h-full outline-none"
          />
        </div>
      </div>
      <div className="pt-8">
        <p className="mb-2">{t('Your Rewards')}</p>
        <div className="reward">
          <div className="artibute rounded-t-lg calamari-text bg-white">
            <div className="flex text-base xl:text-lg justify-between px-3 xl:px-6 pt-4 pb-2">
              <span>{t('Base')}</span>
              <span className="font-semibold">{baseReward && baseReward.toString()} KMA</span>
            </div>
            <div className="flex text-base xl:text-lg items-center justify-between px-3 xl:px-6 py-2 bg-gray">
              <div className="flex items-center">
                <span>{t('Bonus')}</span>
                <span className="text-xs block text-white rounded-sm ml-2 bg-red py-1 px-2">
                  {t('Limited Time')}
                </span>
              </div>
              <span className="font-semibold">{earlyBonus && earlyBonus.toString()} KMA</span>
            </div>
            <div className="flex text-base xl:text-lg justify-between px-3 xl:px-6 pt-2 pb-4">
              <span>{t('Referral')}</span>
              <span className="font-semibold">{referralBonus && referralBonus.toString()} KMA</span>
            </div>
          </div>
          <div className="flex text-2xl xl:text-2xl p-6 result justify-between text-white">
          <span>{t('Rewards')}:</span>
            <span>{totalReward && totalReward.toString()} KMA</span>
          </div>
        </div>
      </div>
      <div
        onClick={onClickClaimButton}
        className="py-6 rounded-lg text-3xl xl:text-3xl cursor-pointer text-center mt-8 mb-4 bg-oriange">
        {t('Claim your KMA')}
      </div>
      <TxStatusDisplay txStatus={contributionStatus} />
      <TxStatusDisplay txStatus={referralStatus} />
    </div>
  );
}

export default Contribute;

// {loading ? (
//   <div className="py-6 px-4 mt-8 items-center flex">
//     <Loader active inline />
//     <span className="text-white pl-4">Processing...</span>
//   </div>
// ) : (
//   <div
//     onClick={onClaimHandler}
//     className="py-6 rounded-lg text-3xl xl:text-4xl cursor-pointer text-center mt-8 mb-4 bg-oriange">

//   </div>
// )}
