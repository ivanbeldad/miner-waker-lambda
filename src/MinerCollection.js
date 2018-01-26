const Miner = require('./Miner')

module.exports = class MinerCollection {
  /**
   *
   * @param {Miner[]} miners
   */
  constructor(miners = []) {
    this.miners = miners
  }

  /**
   *
   * @return {Miner[]}
   */
  get() {
    return this.miners
  }

  /**
   *
   * @param {string} ethosName
   * @return {Miner}
   */
  getByEthosName(ethosName) {
    let miner = null
    this.miners.forEach(currentMiner => {
      if (ethosName === currentMiner.ethosName) {
        miner = currentMiner
      }
    })
    return miner
  }

  /**
   *
   * @param {string} tplinkName
   * @return {Miner}
   */
  getByTpLinkName(tplinkName) {
    let miner = null
    this.miners.forEach(currentMiner => {
      if (tplinkName === currentMiner.tplinkName) {
        miner = currentMiner
      }
    })
    return miner
  }

  /**
   * @return {Miner[]}
   */
  getStoppedMiners() {
    let stopped = this.miners.filter(miner => !miner.isAlive)
    return stopped
  }

}
