import React, { useState } from 'react';
import ArrowDown from 'assets/icons/arrow-down.svg';
import ArrowUp from 'assets/icons/arrow-up.svg';
import classNames from 'classnames';
import Kusama from 'types/Kusama';
import Decimal from 'decimal.js';

const Details = ({ userContributions }) => {
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(Math.ceil(userContributions.length / 5, 1), 1);
  const currentPageUserContributions = userContributions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const userTotalContributions = userContributions.reduce(
    (acc, cur) => acc.add(cur.amountKSM), new Kusama(Kusama.KSM, new Decimal(0)));
  const dateFormatOptions = { month: 'short', day: 'numeric' };

  return (
    <div className="content-item p-8 xl:p-10 h-full mt-8 lg:mt-0 bg-white calamari-text details">
      <h1 className="title text-3xl md:text-4xl">Your Details</h1>
      <div className="flex">
        <div className="w-3/5">
          <p className="mb-0 pb-5">Total Contributions</p>
          <span className="purple-text text-lg xl:text-2xl font-semibold">
            {userTotalContributions.toString()}
          </span>
        </div>
        <div className="w-2/5">
          <p className="mb-0 pb-5">Total Rewards</p>
          <span className="purple-text text-lg xl:text-2xl font-semibold">
            ??? KMA
          </span>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <p className="mb-1">Contribution History</p>
        <span className="opacity-50">{currentPage} of {totalPages}</span>
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
              currentPage > 1 && setCurrentPage(currentPage - 1)
            }
            alt="arrow-up"
            className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-12 bg-white rounded-full"
          />
          <img
            src={ArrowDown}
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            alt="arrow-down"
            className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-12 bg-white rounded-full"
          />
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <p className="mb-1">Referral History</p>
        <span className="opacity-50">{currentPage} of {totalPages}</span>
      </div>
      <div>
        <div className="artibute border-2 z-10 history relative rounded-lg calamari-text bg-white">
          {/* <div className="flex text-lg justify-between pl-6 pr-10 pt-4 pb-2">
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
          </div> */}
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
      </div>
    </div>
  );
};

export default Details;
