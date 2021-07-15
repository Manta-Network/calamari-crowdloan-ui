import store from 'store';

const env = 'dev'; // todo

class Persistence {
  static loadUserContributions () {
    return store.get(`${env}calamariCrowdloanUserContributions`, []);
  }

  static addUserContribution (contribution) {
    const contributions = Persistence.loadUserContributions();
    contributions.push(contribution.toJson());
  }
}

export default Persistence;
