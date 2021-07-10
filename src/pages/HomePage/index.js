import React from 'react';
import Navbar from 'components/Layouts/Navbar';
import { Grid, Input } from 'semantic-ui-react';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <div className="home-content">
        <Grid columns="three">
          <Grid.Row>
            <Grid.Column>
              <div className="content-item contribute">
                <h1 className="title">Contribute</h1>
                <p className="mb-1">Enter Your Contribution Amount</p>
                <div className="flex items-center">
                  <div className="w-full form-input amount relative h-18">
                    <Input
                      className="w-full h-full outline-none"
                      defaultValue="13"
                    />
                    <span className="uppercase text-3xl mt-2 right-0 mr-2 max-btn font-semibold absolute px-5 py-3 rounded-md">
                      max
                    </span>
                  </div>
                  <span className="text-4xl font-semibold pl-4">KSM</span>
                </div>
                <div className="pt-8">
                  <p className="mb-1">Enter Your Referral Code Optional</p>
                  <div className="w-full form-input relative h-18">
                    <Input
                      className="w-full h-full outline-none"
                      defaultValue="Mantra2021"
                    />
                  </div>
                </div>
                <div className="pt-8">
                  <p className="mb-1">Reward Calculator</p>
                  <div className="reward">
                    <div className="artibute rounded-t-lg calamari-text bg-white">
                      <div className="flex text-lg justify-between px-6 pt-4 pb-2">
                        <span>Base</span>
                        <span>150,000 KMA</span>
                      </div>
                      <div className="flex text-lg justify-between px-6 py-2 bg-gray">
                        <div>
                          <span>Bonus</span>
                          <span className="text-sm px-4 text-white rounded-sm ml-2 bg-red py-2">
                            Limited Time
                          </span>
                        </div>
                        <span>15,000 KMA</span>
                      </div>
                      <div className="flex text-lg justify-between px-6 pt-2 pb-4">
                        <span>Referral</span>
                        <span>7,500 KMA</span>
                      </div>
                    </div>
                    <div className="flex text-3xl p-6 result justify-between text-white">
                      <span>Rewards:</span>
                      <span>172,500</span>
                    </div>
                  </div>
                </div>
                <div className="py-6 rounded-lg text-4xl text-center mt-8 bg-oriange">
                  Claim Your KMA
                </div>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="content-item details">
                <h1 className="title">Your Details</h1>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className="content-item crowdloan">
                <h1 className="title">The Crowdloan</h1>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

export default HomePage;
