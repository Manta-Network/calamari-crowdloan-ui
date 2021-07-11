import React from 'react';
import Navbar from 'components/Layouts/Navbar';
import { Grid } from 'semantic-ui-react';
import {
  Details,
  Contribute,
  Crowdloan,
  ContributeActivity
} from 'components/HomeComponents';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <div className="home-content">
        <Grid columns="three">
          <Grid.Row className="flex-wrap flex">
            <Grid.Column className="flex-wrap flex">
              <Contribute />
            </Grid.Column>
            <Grid.Column className="flex-wrap flex">
              <Details />
            </Grid.Column>
            <Grid.Column className="flex-wrap flex">
              <Crowdloan />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <ContributeActivity />
    </div>
  );
};

export default HomePage;
