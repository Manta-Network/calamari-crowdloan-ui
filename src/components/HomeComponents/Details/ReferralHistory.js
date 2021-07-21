/* eslint-disable multiline-ternary */
import React, { useState } from 'react';
import ArrowDown from 'assets/icons/arrow-down.svg';
import ArrowUp from 'assets/icons/arrow-up.svg';
import { Placeholder } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const ReferralHistoryPlaceholder = () => {
  return (
  <div className="py-12">
    <Placeholder fluid>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
    </Placeholder>
  </div>
  );
};

const ReferralHistory = ({ userReferrals }) => {
  const [currentPageNumberUserReferrals, setCurrentPageNumberUserReferrals] = useState(1);

  const PAGE_SIZE = 5;
  const totalPagesUserReferrals = Math.max(Math.ceil(userReferrals?.length / 5, 1), 1);
  const currentPageUserReferrals = userReferrals?.slice((currentPageNumberUserReferrals - 1) * PAGE_SIZE, currentPageNumberUserReferrals * PAGE_SIZE);
  const dateFormatOptions = { month: 'short', day: 'numeric' };
  const { t } = useTranslation();

  if (!userReferrals) {
    return <ReferralHistoryPlaceholder />;
  }
  return (
        <>
        <div className="flex justify-between pt-10">
        <p className="mb-1">{t('Referral history')}</p>
        <span className="opacity-50">{currentPageNumberUserReferrals} of {totalPagesUserReferrals}</span>
      </div>
      <div>
        <div className="artibute border-2 z-10 history relative rounded-lg calamari-text bg-white">
          <div className='pt-2'>
            {currentPageUserReferrals.map((referral, index) => (

              <div
                key={index}
                className={classNames(
                  'flex text-lg justify-between pl-6 pr-10 py-2',
                  { 'bg-gray': index % 2 }
                )}>
                <span>{referral.date.toLocaleDateString('en-US', dateFormatOptions)}</span>
                <span className="font-semibold">{referral.amountKSM.toString()}</span>
              </div>
            ))
            }
          </div>
          <img
            src={ArrowDown}
            alt="arrow-down"
            className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-12 bg-white rounded-full"
            onClick={() =>
              currentPageNumberUserReferrals < totalPagesUserReferrals && setCurrentPageNumberUserReferrals(currentPageNumberUserReferrals + 1)
            }
          />
          <img
            src={ArrowUp}
            alt="arrow-up"
            className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-12 bg-white rounded-full"
            onClick={() =>
              currentPageNumberUserReferrals > 1 && setCurrentPageNumberUserReferrals(currentPageNumberUserReferrals - 1)
            }
          />
        </div>
      </div>
      </>
  );
};

export default ReferralHistory;
