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
    <div className="home-page px-6 sm:px-16 xl:px-40">
      <Navbar />
      <div className="home-content py-6">
        <Grid columns="three">
          <Grid.Row className="flex-wrap flex-col flex">
            <Grid.Column className="flex-wrap item flex">
              <Contribute />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
              <Details />
            </Grid.Column>
            <Grid.Column className="flex-wrap item flex">
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
