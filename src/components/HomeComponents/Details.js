import React, { useState } from 'react';
import ArrowDown from 'assets/icons/arrow-down.svg';
import ArrowUp from 'assets/icons/arrow-up.svg';
import FakeData from 'pages/FakeData';
import classNames from 'classnames';

const Details = () => {
  const [currentPage, setcurrentPage] = useState(1);
  return (
    <div className="content-item h-full bg-white calamari-text details">
      <h1 className="title">Your Details</h1>
      <div className="flex">
        <div className="w-1/2">
          <p className="mb-0 pb-5">Total Contributions</p>
          <span className="purple-text text-3xl font-semibold">200 KSM</span>
        </div>
        <div className="w-1/2">
          <p className="mb-0 pb-5">Total Rewards</p>
          <span className="purple-text text-3xl font-semibold">
            450,000 KMA
          </span>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <p className="mb-1">Contribution History</p>
        <span className="opacity-50">{currentPage} of 50</span>
      </div>
      <div>
        <div className="artibute border-2 py-2 z-10 history relative rounded-lg calamari-text bg-white">
          {FakeData.contributions[currentPage].map((val, index) => (
            <div
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
      </div>
      <div className="flex justify-between pt-6">
        <p className="mb-1">Referral History</p>
        <span className="opacity-50">1 of 50</span>
      </div>
      <div>
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
      </div>
    </div>
  );
};

export default Details;
