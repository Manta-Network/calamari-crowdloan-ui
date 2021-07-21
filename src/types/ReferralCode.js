import { encodeAddress, decodeAddress } from '@polkadot/util-crypto';
import { hexToU8a, u8aToHex, hexAddPrefix, hexStripPrefix } from '@polkadot/util';

export default class ReferralCode {
  constructor (bytes) {
    this.bytes = bytes;
  }

  static fromAddress (address) {
    return new ReferralCode(decodeAddress(address));
  }

  static fromHexStr (hexStr) {
    if (hexStr.length !== 64) {
      throw Error('Invalid referral code');
    }
    return new ReferralCode(hexToU8a(hexAddPrefix(hexStr)));
  }

  toAddress () {
    return encodeAddress(this.bytes);
  }

  toString () {
    return hexStripPrefix(u8aToHex(this.bytes));
  }
}
