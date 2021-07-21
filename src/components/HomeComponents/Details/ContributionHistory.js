/* eslint-disable multiline-ternary */
import React, { useState } from 'react';
import ArrowDown from 'assets/icons/arrow-down.svg';
import ArrowUp from 'assets/icons/arrow-up.svg';
import { Placeholder } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const ContributionHistoryPlaceholder = () => {
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

const ContributionHistory = ({ userContributions }) => {
  const { t } = useTranslation();
  const PAGE_SIZE = 5;
  const [currentPageNumberUserContributions, setCurrentPageNumberUserContributions] = useState(1);
  const totalPagesUserContributions = userContributions && Math.max(Math.ceil(userContributions.length / 5, 1), 1);
  const currentPageUserContributions = userContributions && userContributions.slice((currentPageNumberUserContributions - 1) * PAGE_SIZE, currentPageNumberUserContributions * PAGE_SIZE);
  const dateFormatOptions = { month: 'short', day: 'numeric' };

  if (!userContributions) {
    return <ContributionHistoryPlaceholder />;
  }
  return (
        <>
        <div className="flex justify-between pt-6">
        <p className="mb-1">{t('Contribution history')}</p>
        <span className="opacity-50">{currentPageNumberUserContributions} of {totalPagesUserContributions}</span>
        </div>
        <div>
        <div className="artibute border-2 py-2 z-10 history relative rounded-lg calamari-text bg-white">
          {currentPageUserContributions.map((contribution, index) => (
            <div
              key={index}
              className={classNames(
                'flex text-lg justify-between pl-6 pr-10 py-2',
                { 'bg-gray': index % 2 }
              )}>
              <span>{contribution.date.toLocaleDateString('en-US', dateFormatOptions)}</span>
              <span className="font-semibold">{contribution.amountKSM.toString()}</span>
            </div>
          ))}
          <img
            src={ArrowUp}
            onClick={() =>
              currentPageNumberUserContributions > 1 && setCurrentPageNumberUserContributions(currentPageNumberUserContributions - 1)
            }
            alt="arrow-up"
            className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-12 bg-white rounded-full"
          />
          <img
            src={ArrowDown}
            onClick={() =>
              currentPageNumberUserContributions < totalPagesUserContributions && setCurrentPageNumberUserContributions(currentPageNumberUserContributions + 1)
            }
            alt="arrow-down"
            className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-12 bg-white rounded-full"
          />
        </div>
      </div>
      </>
  );
};

export default ContributionHistory;
