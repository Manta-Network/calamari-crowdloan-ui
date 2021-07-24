class Contribution {
  constructor (amountKSM, date, address, referral = null) {
    this.amountKSM = amountKSM;
    this.date = date;
    this.address = address;
    this.referral = referral;
  }
}

export default Contribution;
