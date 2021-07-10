import React from 'react';
import Navbar from 'components/Layouts/Navbar';
import { Grid } from 'semantic-ui-react';
import { Details, Contribute, Crowdloan } from 'components/HomeComponents';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <div className="home-content">
        <Grid columns="three">
          <Grid.Row>
            <Grid.Column>
              <Contribute />
            </Grid.Column>
            <Grid.Column>
              <Details />
            </Grid.Column>
            <Grid.Column>
              <Crowdloan />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

export default HomePage;
