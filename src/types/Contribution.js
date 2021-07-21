class Contribution {
  constructor (amountKSM, date, address) {
    this.amountKSM = amountKSM;
    this.date = date;
    this.address = address;
  }

  // static fromJson (json) {
  //   return new Contribution(json.date, json.amountKSM, json.address);
  // }

  // toJson () {
  //   return { amountKSM: this.amountKSM, date: this.date, rewardKSM: this.address };
  // }
}

export default Contribution;
