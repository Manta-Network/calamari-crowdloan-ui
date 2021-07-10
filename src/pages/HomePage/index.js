import React from 'react';
import Navbar from 'components/Layouts/Navbar';
import { Grid } from 'semantic-ui-react';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <div className="home-content">
      <Grid columns='three'>
        <Grid.Row>
          <Grid.Column>
            <div className="content-item contribute">
              <h1 className="title">Contribute</h1>
              <span>Enter Your Contribution Amount</span>
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
