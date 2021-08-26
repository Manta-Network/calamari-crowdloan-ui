/* eslint-disable multiline-ternary */
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import Decimal from 'decimal.js';
import formatPayloadForSubstrate from 'utils/FormatPayloadForSubstrate';
import BN from 'bn.js';
import { useTranslation } from 'react-i18next';
import Calamari from 'types/Calamari';
import config from 'config';
import ReferralCode from 'types/ReferralCode';
import Contribution from 'types/Contribution';
import TxStatus from '../../types/TxStatus';
import TxStatusDisplay from '../Layouts/TxStatusDisplay';
import Kusama from '../../types/Kusama';
import { makeTxResHandler } from '../../utils/MakeTxResHandler';
import { useSubstrate } from '../../substrate-lib';

const CreateAccountPrompt = () => {
  const { t } = useTranslation();
  return (
    <div className="content-item p-8 xl:p-10 h-full contribute flex-1">
      <h1 className="title text-3xl md:text-4xl">{t('Contribute')}</h1>
      <p href='#' className="mb-2 text-md xl:text-base">
        {t('Create an account in polkadot.js to continue')}
      </p>
    </div>
  );
};

const InstallPJSPrompt = () => {
  const { t } = useTranslation();
  return (
    <div className="content-item p-8 xl:p-10 h-full contribute flex-1">
      <h1 className="title text-3xl md:text-4xl">{t('Contribute')}</h1>
      <a className="mb-2 text-md xl:text-base" href='https://polkadot.js.org/extension/'>
        {t('Install polkadot.js wallet to continue')}
      </a>
    </div>
  );
};

function Contribute ({
  fromAccount,
  accountBalanceKSM,
  urlReferralCode,
  allContributors,
  accountAddress,
  keyringIsInit,
  totalContributionsKSM,
  userContributions
}) {
  const [contributionStatus, setContributionStatus] = useState(null);
  const [contributeAmountInput, setContributeAmountInput] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [referralCode, setReferralCode] = useState();
  const [referralCodeInvalid, setReferralCodeInvalid] = useState(false);
  const [userReferredSelf, setUserReferredSelf] = useState(false);
  const { api } = useSubstrate();
  const { t } = useTranslation();

  const getContributeAmounKSM = () => {
    try {
      return new Kusama(Kusama.KSM, new Decimal(contributeAmountInput));
    } catch (error) {
      return Kusama.zero();
    }
  };
  const contributeAmountKSM = getContributeAmounKSM();
  const contributeAmountAtomicUnits = contributeAmountKSM?.toAtomicUnits();

  const getEarlyBonus = () => {
    if (!allContributors || !contributeAmountKSM) {
      return Calamari.zero();
    } else if (
      allContributors.length < config.EARLY_BONUS_TIER_1_CUTOFF
      || allContributors.slice(0, config.EARLY_BONUS_TIER_1_CUTOFF).includes(accountAddress)
    ) {
      return contributeAmountKSM.toKMABonusRewardTier1();
    } else if (
      allContributors.length < config.EARLY_BONUS_TIER_2_CUTOFF
      || allContributors.slice(0, config.EARLY_BONUS_TIER_2_CUTOFF).includes(accountAddress)
    ) {
      return contributeAmountKSM.toKMABonusRewardTier2();
    } else {
      return Calamari.zero();
    }
  };
  const earlyBonus = getEarlyBonus();

  const getReferalBonus = () => {
    if (!contributeAmountKSM && !userContributions) return null;
    const previousReferral = userContributions?.some(contribution => contribution.referral);
    return (referralCode || previousReferral) ? contributeAmountKSM.toKMAWasReferredReward() : Calamari.zero();
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

  const onContributeSuccess = block => {
    setContributionStatus(TxStatus.finalized(block));
  };
  const onContributeFailure = (block, error) => {
    console.error(error);
    setContributionStatus(TxStatus.failed(block, error));
  };
  const onContributeUpdate = message => {
    setContributionStatus(TxStatus.processing(message));
  };

  const buildReferralTx = () => {
    const memo = api.createType('Memo', referralCode.bytes);
    return api.tx.crowdloan.addMemo(
      config.PARA_ID, memo.toHex()
    );
  };

  const getUserMaxContributionKSM = () => {
    if (!accountBalanceKSM) {
      return Kusama.zero();
    }
    const estimatedFeeAmount = new Kusama(Kusama.KSM, new Decimal(0.1));
    return accountBalanceKSM.minus(estimatedFeeAmount).max(Kusama.zero());
  };
  const userMaxContributionKSM = getUserMaxContributionKSM();

  const getCrowdloanRemainingFundsKSM = () => {
    const crowdloanKSMTarget = new Kusama(Kusama.KSM, new Decimal(config.CROWDLOAN_KSM_TARGET));
    return crowdloanKSMTarget.minus(totalContributionsKSM).max(Kusama.zero());
  };
  const crowdloanRemainingFundsKSM = getCrowdloanRemainingFundsKSM();

  const maxContributionKSM = userMaxContributionKSM.min(crowdloanRemainingFundsKSM);

  const onClickMax = () => {
    accountBalanceKSM && setContributeAmountInput(maxContributionKSM.toString(false));
  };

  const onChangeContributeAmountInput = e => {
    const input = e.target.value;
    if ((isNaN(input) && input !== '') || (parseFloat(e.target.value) < 0)) {
      return;
    }
    setContributeAmountInput(input);
  };

  const buildContributeTx = () => {
    return api.tx.crowdloan.contribute(
      ...formatPayloadForSubstrate([
        config.PARA_ID,
        new BN(contributeAmountAtomicUnits.value.toString()),
        null
      ])
    );
  };

  useEffect(() => {
    if (!accountAddress) {
      return;
    }
    const handleReferralCodeInputChange = () => {
      if (referralCodeInput === '') {
        setReferralCode(null);
        setUserReferredSelf(false);
        setReferralCodeInvalid(false);
        return;
      }
      try {
        const referralCode = ReferralCode.fromHexStr(referralCodeInput);
        if (referralCode.toAddress() === accountAddress) {
          setReferralCode(null);
          setUserReferredSelf(true);
          setReferralCodeInvalid(false);
        } else {
          setReferralCode(referralCode);
          setUserReferredSelf(false);
          setReferralCodeInvalid(false);
        }
      } catch (error) {
        setReferralCode(null);
        setUserReferredSelf(false);
        setReferralCodeInvalid(true);
      }
    };
    handleReferralCodeInputChange();
  }, [accountAddress, referralCodeInput]);

  const onChangeReferralCodeInput = value => {
    if (value.startsWith(`${config.APP_BASE_URL}?referral=`)) {
      value = value.replace(`${config.APP_BASE_URL}?referral=`, '');
    }
    setReferralCodeInput(value);
  };

  useMemo(() => {
    const setReferralCodeFromURL = () => {
      if (urlReferralCode) {
        onChangeReferralCodeInput(urlReferralCode);
      }
    };
    setReferralCodeFromURL();
  }, [urlReferralCode]);

  const formIsDisabled = contributionStatus && contributionStatus.isProcessing();

  const exceedsTarget = (
    contributeAmountKSM
    && crowdloanRemainingFundsKSM.lt(contributeAmountKSM)
    && contributeAmountInput.length > 0
  );
  const insufficientFunds = (
    contributeAmountKSM
    && contributeAmountKSM.gt(maxContributionKSM)
    && contributeAmountInput.length > 0
  );
  const belowMinContribution = (
    contributeAmountKSM
    && contributeAmountKSM.lt(new Kusama(Kusama.KSM, new Decimal(config.MIN_CONTRIBUTION)))
    && contributeAmountInput.length > 0
  );

  const onClickClaimButton = async () => {
    if (!contributeAmountKSM || insufficientFunds || belowMinContribution || exceedsTarget) {
      return;
    }
    try {
      setContributionStatus(TxStatus.processing(''));
      const txResHandler = makeTxResHandler(api, onContributeSuccess, onContributeFailure, onContributeUpdate);
      const contributeTx = buildContributeTx();
      const referralTx = referralCode && buildReferralTx();
      if (referralTx) {
        const transactions = referralTx ? [contributeTx, referralTx] : [contributeTx];
        api.tx.utility.batch(transactions).signAndSend(fromAccount, txResHandler);
      } else {
        contributeTx.signAndSend(fromAccount, txResHandler);
      }
    } catch (error) {
      console.error(error);
      setContributionStatus(TxStatus.failed(null, error));
    }
  };

  if (!keyringIsInit) {
    return <InstallPJSPrompt />;
  } else if (!fromAccount) {
    return <CreateAccountPrompt />;
  }

  let amountLabel;
  if (contributionStatus) {
    amountLabel = t('Enter your contribution amount');
  } else if (insufficientFunds) {
    amountLabel  = '❌ ' + t('Insufficient funds');
  } else if (belowMinContribution) {
    amountLabel  = '❌ ' + t(`Minimum contribution is ${config.MIN_CONTRIBUTION} KSM`);
  } else if (exceedsTarget) {
    amountLabel  = '❌ ' + t('Contribution exceeds crowdloan target');
  } else {
    amountLabel = t('Enter your contribution amount');
  }

  return (
    <div className="content-item p-8 xl:p-10 h-full contribute flex-1">
      <h1 className="title text-3xl md:text-4xl">{t('Contribute')}</h1>
      <p className="mb-2 text-sm xl:text-base">
        {amountLabel}
      </p>
      <div className="flex items-center">
        <div className="form-input w-4/5 amount relative h-20">
          <Input
            className="h-full w-full outline-none"
            value={contributeAmountInput && contributeAmountInput.toString()}
            type='numher'
            onChange={onChangeContributeAmountInput}
            disabled={formIsDisabled}
          />
          <span onClick={onClickMax} className="uppercase cursor-pointer text-xl xl:text-2xl mt-4 right-0 mr-4 max-btn font-semibold absolute px-5 py-3 rounded-md">
            {t('Max')}
          </span>
        </div>
        <div className="text-2xl xl:text-2xl w-1/5 font-semibold pl-4">KSM</div>
      </div>
      <div className="pt-8">
        <p className="mb-2 text-sm xl:text-base">
          {(!referralCodeInvalid && !userReferredSelf) && t('Enter your referral code (optional)')}
          {userReferredSelf && '❌ ' + t('Cannot refer self')}
          {referralCodeInvalid && '❌ ' + t('Referral code invalid')}
        </p>
        <div className="w-full form-input relative h-20">
          <Input
            value={referralCodeInput}
            onChange={e => onChangeReferralCodeInput(e.target.value)}
            className="w-full h-full outline-none"
            disabled={formIsDisabled}
          />
        </div>
      </div>
      <div className="pt-8">
        <p className="mb-2">{t('Your Rewards')}</p>
        <div className="reward">
          <div className="artibute rounded-t-lg calamari-text bg-white">
            <div className="flex text-base xl:text-lg justify-between px-3 xl:px-6 pt-4 pb-2">
              <span>{t('Base')}</span>
              <span className="font-semibold">{baseReward && baseReward.toString()}</span>
            </div>
            <div className="flex text-base xl:text-lg items-center justify-between px-3 xl:px-6 py-2 bg-gray">
              <div className="flex items-center">
                <span>{t('Bonus')}</span>
                <span className="text-xs block text-white rounded-sm ml-2 bg-red py-1 px-2">
                  {t('Limited Time')}
                </span>
              </div>
              <span className="font-semibold">{earlyBonus && earlyBonus.toString()}</span>
            </div>
            <div className="flex text-base xl:text-lg justify-between px-3 xl:px-6 pt-2 pb-4">
              <span>{t('Referral')}</span>
              <span className="font-semibold">{referralBonus && referralBonus.toString()}</span>
            </div>
          </div>
          <div className="flex text-xl p-6 result justify-between text-white">
            <span>{t('Rewards')}:</span>
            <span>{totalReward && totalReward.toString()}</span>
          </div>
        </div>
      </div>
      {!contributionStatus ? (
        <div
          onClick={onClickClaimButton}
          className="py-6 rounded-lg text-2xl xl:text-2xl cursor-pointer text-center mt-8 mb-4 bg-oriange">
          {t('Contribute')}
        </div>
      ) : (
        <TxStatusDisplay txStatus={contributionStatus} transactionType={'Contribution'} />
      )}
    </div>
  );
}

Contribute.propTypes = {
  fromAccount: PropTypes.string,
  accountBalanceKSM: PropTypes.instanceOf(Kusama),
  urlReferralCode: PropTypes.string,
  allContributors: PropTypes.arrayOf(PropTypes.string),
  accountAddress: PropTypes.string,
  polkadotJSInstalled: PropTypes.bool,
  setAccountAddress: PropTypes.func,
  accountPair: PropTypes.object,
  keyringIsInit: PropTypes.bool,
  totalContributionsKSM: PropTypes.instanceOf(Kusama),
  userContributions: PropTypes.arrayOf(PropTypes.instanceOf(Contribution)),
};

export default Contribute;
