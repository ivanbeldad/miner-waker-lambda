module.exports = class Miner {
  /**
   *
   * @param {object} obj
   * @param {string} obj.ethosName
   * @param {string} obj.tplinkName
   * @param {boolean} obj.isAlive
   */
  constructor(obj = {ethosName, tplinkName, isAlive}) {
    this.ethosName = obj.ethosName
    this.tplinkName = obj.tplinkName
    this.isAlive = obj.isAlive
  }
}
