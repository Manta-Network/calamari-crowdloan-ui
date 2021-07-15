class Contribution {
  constructor (amountKSM, date, rewardKSM) {
    this.amountKSM = amountKSM;
    this.date = date;
    this.rewardKMA = rewardKMA;
  }

  static fromJson (json) {
    return new Contribution(json.date, json.amountKSM, json.rewardKSM);
  }

  toJson () {
    return { amountKSM: this.amountKSM, date: this.date, rewardKSM: this.rewardKSM };
  }
}
