import Decimal from 'decimal.js';

export default class Calamari {
    static DISPLAY_OPTIONS = { maximumFractionDigits: 0, minimumFractionDigits: 0 };

    constructor (amountKMA) {
      this.amountKMA = amountKMA;
    }

    static zero () {
      return new Calamari(new Decimal(0));
    }

    add (other) {
      return new Calamari(this.amountKMA.add(other.amountKMA));
    }

    gt (other) {
      return this.amountKMA.gt(other.amountKMA);
    }

    toString () {
      return this.amountKMA.toNumber().toLocaleString(undefined, Calamari.DISPLAY_OPTIONS) + ' KMA';
    }
}
