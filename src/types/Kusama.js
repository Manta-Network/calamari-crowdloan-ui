import Decimal from 'decimal.js';
import Calamari from './Calamari';

const KUSAMA_CHAIN_DECIMALS = 12;

function kusamaToAtomicUnits (amount) {
  return new Decimal(10).pow(new Decimal(KUSAMA_CHAIN_DECIMALS)).mul(amount);
}

function atomicUnitsToKSM (amount) {
  return amount.div(new Decimal(10).pow(new Decimal(KUSAMA_CHAIN_DECIMALS)));
}

class Kusama {
    static ATOMIC_UNITS = 'atomic units';
    static KSM = 'KSM';
    static DISPLAY_OPTIONS = { maximumFractionDigits: 1, minimumFractionDigits: 0 };

    constructor (denomination, value) {
      this.denomination = denomination;
      this.value = value;
    }

    static zero () {
      return new Kusama(Kusama.KSM, new Decimal(0));
    }

    minus (kusama) {
      if (this.denomination !== kusama.denomination) {
        throw Error('Cannot subtrract; denominations do not match');
      } else {
        return new Kusama(this.denomination, this.value.minus(kusama.value));
      }
    }

    add (kusama) {
      if (this.denomination !== kusama.denomination) {
        throw Error('Cannot add; denominations do not match');
      } else {
        return new Kusama(this.denomination, this.value.add(kusama.value));
      }
    }

    min (kusama) {
      if (this.denomination !== kusama.denomination) {
        throw Error('Cannot get min; denominations do not match');
      } else {
        return new Kusama(this.denomination, Decimal.min(this.value, kusama.value));
      }
    }

    max (kusama) {
      if (this.denomination !== kusama.denomination) {
        throw Error('Cannot get max; denominations do not match');
      } else {
        return new Kusama(this.denomination, Decimal.max(this.value, kusama.value));
      }
    }

    gt (kusama) {
      if (this.denomination !== kusama.denomination) {
        throw Error('Cannot get max; denominations do not match');
      } else {
        return this.value.gt(kusama.value);
      }
    }

    lt (kusama) {
      if (this.denomination !== kusama.denomination) {
        throw Error('Cannot get max; denominations do not match');
      } else {
        return this.value.lt(kusama.value);
      }
    }

    toAtomicUnits () {
      if (this.denomination === Kusama.ATOMIC_UNITS) {
        throw Error('Cannot convert atomic units to atomic units');
      }
      return new Kusama(Kusama.ATOMIC_UNITS, kusamaToAtomicUnits(this.value));
    }

    toKSM () {
      if (this.denomination === Kusama.KSM) {
        throw Error('Cannot convert KSM to KSM');
      }
      return new Kusama(Kusama.KSM, atomicUnitsToKSM(this.value));
    }

    toKMABaseReward () {
      if (this.denomination !== Kusama.KSM) {
        throw Error('Cannot calculate reward from atomic units');
      }
      return new Calamari(this.value.mul(10000));
    }

    toKMABonusRewardTier1 () {
      if (this.denomination !== Kusama.KSM) {
        throw Error('Cannot calculate reward from atomic units');
      }
      return new Calamari(this.value.mul(1000));
    }

    toKMABonusRewardTier2 () {
      if (this.denomination !== Kusama.KSM) {
        throw Error('Cannot calculate reward from atomic units');
      }
      return new Calamari(this.value.mul(500));
    }

    toKMAGaveReferralReward () {
      if (this.denomination !== Kusama.KSM) {
        throw Error('Cannot calculate reward from atomic units');
      }
      return new Calamari(this.value.mul(250));
    }

    toKMAWasReferredReward () {
      if (this.denomination !== Kusama.KSM) {
        throw Error('Cannot calculate reward from atomic units');
      }
      return new Calamari(this.value.mul(250));
    }

    toString (includeUnits = true) {
      if (this.denomination === Kusama.ATOMIC_UNITS) {
        return this.value.toNumber().toLocaleString(undefined, Kusama.DISPLAY_OPTIONS);
      } else if (this.denomination === Kusama.KSM) {
        let string = this.value.toNumber().toLocaleString(undefined, Kusama.DISPLAY_OPTIONS);
        if (includeUnits) {
          string = string + ' KSM';
        }
        return string;
      }
    }
}

export default Kusama;
