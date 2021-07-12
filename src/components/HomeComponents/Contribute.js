import React from 'react';
import { Input } from 'semantic-ui-react';

const Contribute = () => {
  return (
    <div className="content-item p-8 xl:p-10 h-full contribute flex-1">
      <h1 className="title text-3xl md:text-4xl">Contribute</h1>
      <p className="mb-1 text-sm xl:text-base">Enter Your Contribution Amount</p>
      <div className="flex items-center">
        <div className="form-input w-4/5 amount relative h-18">
          <Input className="h-full w-full outline-none" defaultValue="13" />
          <span className="uppercase cursor-pointer text-xl xl:text-3xl mt-2 right-0 mr-2 max-btn font-semibold absolute px-5 py-3 rounded-md">
            max
          </span>
        </div>
        <div className="text-2xl xl:text-4xl w-1/5 font-semibold pl-4">KSM</div>
      </div>
      <div className="pt-8">
        <p className="mb-1 text-sm xl:text-base">Enter Your Referral Code (Optional)</p>
        <div className="w-full form-input relative h-18">
          <Input
            className="w-full h-full outline-none"
            defaultValue="Manta2021"
          />
        </div>
      </div>
      <div className="pt-8">
        <p className="mb-1">Your Rewards</p>
        <div className="reward">
          <div className="artibute rounded-t-lg calamari-text bg-white">
            <div className="flex text-base xl:text-lg justify-between px-3 xl:px-6 pt-4 pb-2">
              <span>Base</span>
              <span className="font-semibold">150,000 KMA</span>
            </div>
            <div className="flex text-base xl:text-lg items-center justify-between px-3 xl:px-6 py-2 bg-gray">
              <div className="flex items-center">
                <span>Bonus</span>
                <span className="text-xs block text-white rounded-sm ml-2 bg-red py-1 px-2">
                  Limited Time
                </span>
              </div>
              <span className="font-semibold">15,000 KMA</span>
            </div>
            <div className="flex text-base xl:text-lg justify-between px-3 xl:px-6 pt-2 pb-4">
              <span>Referral</span>
              <span className="font-semibold">7,500 KMA</span>
            </div>
          </div>
          <div className="flex text-2xl xl:text-3xl p-6 result justify-between text-white">
            <span>Rewards:</span>
            <span>172,500</span>
          </div>
        </div>
      </div>
      <div className="py-6 rounded-lg text-3xl xl:text-4xl cursor-pointer text-center mt-8 mb-4 bg-oriange">
        Claim Your KMA
      </div>
    </div>
  );
};

export default Contribute;
