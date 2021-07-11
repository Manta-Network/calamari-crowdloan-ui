import React from 'react';
import ArrowDown from 'assets/icons/arrow-down.svg';
import ArrowUp from 'assets/icons/arrow-up.svg';
<img src={ArrowDown} alt="arrow-down" />;
const Details = () => {
  return (
    <div className="content-item bg-white calamari-text details">
      <h1 className="title">Your Details</h1>
      <div className="flex">
        <div className="w-1/2">
          <p className="mb-0 calamari-text pb-5">Total Contributions</p>
          <span className="purple-text text-2xl font-semibold">200 KSM</span>
        </div>
        <div className="w-1/2">
          <p className="mb-0 calamari-text pb-5">Total Rewards</p>
          <span className="purple-text text-2xl font-semibold">
            450,000 KMA
          </span>
        </div>
      </div>
      <div className="h-48 py-4">Graph coming soon!</div>
      <div className="flex justify-between">
        <p className="mb-1">Contribution History</p>
        <span className="opacity-50">1 of 50</span>
      </div>
      <div>
        <div className="artibute border-2 z-10 history relative rounded-lg calamari-text bg-white">
          <div className="flex text-lg justify-between px-6 pt-4 pb-2">
            <span>7/3/2021</span>
            <span className="font-semibold">15 KSM</span>
          </div>
          <div className="flex text-lg justify-between px-6 py-2 bg-gray">
            <span>7/3/2021</span>
            <span className="font-semibold">7 KSM</span>
          </div>
          <div className="flex text-lg justify-between px-6 pt-2 pb-4">
            <span>7/3/2021</span>
            <span className="font-semibold">3 KSM</span>
          </div>
          <img
            src={ArrowDown}
            alt="arrow-down"
            className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-3 bg-white rounded-full"
          />
          <img
            src={ArrowUp}
            alt="arrow-up"
            className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-3 bg-white rounded-full"
          />
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <p className="mb-1">Referral History</p>
        <span className="opacity-50">1 of 50</span>
      </div>
      <div>
        <div className="artibute border-2 z-10 history relative rounded-lg calamari-text bg-white">
          <div className="flex text-lg justify-between px-6 pt-4 pb-2">
            <span>7/3/2021</span>
            <span className="font-semibold">15 KSM</span>
          </div>
          <div className="flex text-lg justify-between px-6 py-2 bg-gray">
            <span>7/3/2021</span>
            <span className="font-semibold">7 KSM</span>
          </div>
          <div className="flex text-lg justify-between px-6 pt-2 pb-4">
            <span>7/3/2021</span>
            <span className="font-semibold">3 KSM</span>
          </div>
          <img
            src={ArrowDown}
            alt="arrow-down"
            className="h-8 w-8 arrow-down absolute cursor-pointer z-20 p-2 mb-3 bg-white rounded-full"
          />
          <img
            src={ArrowUp}
            alt="arrow-up"
            className="h-8 w-8 arrow-down absolute z-20 cursor-pointer top-0 p-2 mt-3 bg-white rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
