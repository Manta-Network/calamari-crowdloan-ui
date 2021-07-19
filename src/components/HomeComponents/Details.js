/* eslint-disable multiline-ternary */
import React, { useState, useEffect } from 'react';
import ArrowDown from 'assets/icons/arrow-down.svg';
import ArrowUp from 'assets/icons/arrow-up.svg';
import { Placeholder } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import FakeData from 'pages/FakeData';
import classNames from 'classnames';

const Details = () => {
  const { t } = useTranslation();
  const [currentPage, setcurrentPage] = useState(1);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowPlaceholder(false);
    }, 2000);
  }, []);

  return (
    <div className="content-item p-8 xl:p-10 h-full mt-8 lg:mt-0 bg-white calamari-text details">
      <h1 className="title text-3xl md:text-4xl">{t('Your details')}</h1>
      {showPlaceholder ? (
        <div className="py-2">
          <Placeholder fluid>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder>
        </div>
      ) : (
        <div className="flex">
          <div className="w-3/5">
            <p className="mb-0 pb-5 total-title">{t('Total contributions ')}</p>
            <span className="purple-text total-value text-lg font-semibold">
              200 KSM
            </span>
          </div>
          <div className="w-2/5">
            <p className="mb-0 pb-5 total-title">{t('Total rewards ')}</p>
            <span className="purple-text total-value text-lg font-semibold">
              450,000 KMA
            </span>
          </div>
        </div>
      )}

      {showPlaceholder ? (
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
      ) : (
        <>
          <div className="flex justify-between pt-6">
            <p className="mb-1">{t('Contribution history')}</p>
            <span className="opacity-50">{currentPage} of 50</span>
          </div>
          <div className="artibute border-2 py-2 z-10 history relative rounded-lg calamari-text bg-white">
            {FakeData.contributions[currentPage].map((val, index) => (
              <div
                key={index}
                className={classNames(
                  'flex text-lg justify-between pl-6 pr-10 py-2',
                  { 'bg-gray': index % 2 },
                )}>
                <span>{val.date}</span>
                <span className="font-semibold">{val.KSM} KSM</span>
              </div>
            ))}
            <img
              src={ArrowUp}
              onClick={() =>
                setcurrentPage(currentPage < 2 ? 1 : currentPage - 1)
              }
              alt="arrow-up"
              className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-12 bg-white rounded-full"
            />
            <img
              src={ArrowDown}
              onClick={() =>
                setcurrentPage(currentPage > 3 ? 4 : currentPage + 1)
              }
              alt="arrow-down"
              className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-12 bg-white rounded-full"
            />
          </div>
        </>
      )}

      {showPlaceholder ? (
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
      ) : (
        <>
          <div className="flex justify-between pt-10">
            <p className="mb-1">{t('Referral history')}</p>
            <span className="opacity-50">1 of 50</span>
          </div>
          <div className="artibute border-2 z-10 history relative rounded-lg calamari-text bg-white">
            <div className="flex text-lg justify-between pl-6 pr-10 pt-4 pb-2">
              <span>7/3/2021</span>
              <span className="font-semibold">15 KSM</span>
            </div>
            <div className="flex text-lg justify-between pl-6 pr-10 py-2 bg-gray">
              <span>7/3/2021</span>
              <span className="font-semibold">7 KSM</span>
            </div>
            <div className="flex text-lg justify-between pl-6 pr-10 py-2">
              <span>7/3/2021</span>
              <span className="font-semibold">3 KSM</span>
            </div>
            <div className="flex text-lg justify-between pl-6 pr-10 py-2 bg-gray">
              <span>7/3/2021</span>
              <span className="font-semibold">5 KSM</span>
            </div>
            <div className="flex text-lg justify-between pl-6 pr-10 pt-2 pb-4">
              <span>7/3/2021</span>
              <span className="font-semibold">3 KSM</span>
            </div>
            <img
              src={ArrowDown}
              alt="arrow-down"
              className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-12 bg-white rounded-full"
            />
            <img
              src={ArrowUp}
              alt="arrow-up"
              className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-12 bg-white rounded-full"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
