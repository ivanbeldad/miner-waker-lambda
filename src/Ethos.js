const request = require('request-promise-native')
const Miner = require('./Miner')
const MinerCollection = require('./MinerCollection')

class Ethos {

  /**
   *
   * @param {object} obj
   * @param {string} obj.url
   */
  constructor(obj = { url }) {
    this.url = obj.url
  }

  /**
   *
   * @param {MinerCollection} minerCollection
   */
  updateMinersStatus(minerCollection) {
    return new Promise((resolve, reject) => {
      request.get(this.url)
      .then(result => {
        let rigs = JSON.parse(result).rigs

        for (let rig in rigs) {
          let miner = minerCollection.getByEthosName(rig)
          let isAlive = rigs[rig].condition === 'mining' || rigs[rig].condition === 'just_booted'
          miner.isAlive = isAlive
          let status = miner.isAlive ? 'UP' : 'DOWN'
          console.info(`Miner ${miner.tplinkName} [${rig}] is ${status}`)
        }

        return resolve(minerCollection)
      })
      .catch(err => reject(err))
    })
  }

}

module.exports = Ethos
