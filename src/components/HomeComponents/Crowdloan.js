import React from 'react';

const Crowdloan = () => {
  return (
    <div className="content-item h-full bg-white calamari-text crowdloan">
      <h1 className="title">The Crowdloan</h1>
      <div className="flex">
        <div className="w-1/2">
          <p className="mb-0 calamari-text pb-5">Total Contributions</p>
          <span className="purple-text text-2xl font-semibold">45,200 KSM</span>
        </div>
        <div className="w-1/2">
          <p className="mb-0 calamari-text pb-5">Total Rewards</p>
          <span className="purple-text text-2xl font-semibold">
            15,450,000 KMA
          </span>
        </div>
      </div>
      <div className="h-48 py-4">Graph coming soon!</div>
    </div>
  );
};

export default Crowdloan;
