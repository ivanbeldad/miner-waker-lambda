const fs = require('fs')
const jsYaml = require('js-yaml')
const Miner = require('./Miner')
const MinerCollection = require('./MinerCollection')

module.exports = {
  load: () => {
    const configLocation = process.env.config || 'config.yml'
    let config = jsYaml.load(fs.readFileSync(configLocation))
    const miners = config.miners.map(m => new Miner({
      ethosName: m.ethosName,
      tplinkName: m.tplinkName
    }))
    config.minerCollection = new MinerCollection(miners)
    return config
  }
}
