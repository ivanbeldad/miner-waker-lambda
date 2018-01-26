const configLoader = require('./configLoader')
const Tplink = require('./Tplink')
const Ethos = require('./Ethos')

exports.handler = (event, context, callback) => {
  const config = configLoader.load()
  const tplink = new Tplink({
    url: config.tplink.url,
    cloudUserName: config.tplink.cloudUserName,
    cloudPassword: config.tplink.cloudPassword,
    terminalUUID: config.tplink.terminalUUID,
    tokenLocation: config.tplink.tokenLocation
  })
  const ethos = new Ethos({
    url: config.ethos.url
  })
  const minerCollection = config.minerCollection
  ethos.updateMinersStatus(minerCollection)
    .then(() => {
      const promises = []

      minerCollection.getStoppedMiners().forEach(miner => {
        console.info(`${miner.tplinkName} is stopped`)
        promises.push(tplink.reset(miner))
      })

      return Promise.all(promises)
        .then(() => {
          callback(null, `Everything finished successfully.`)
        })
    })
    .catch(err => {
      console.error(err)
      callback(null, 'Finished with errors.')
    })
}
