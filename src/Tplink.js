const url = require('url')
const fs = require('fs')
const request = require('request-promise-native')
const Miner = require('./Miner')


class Tplink {
  /**
   *
   * @param {object} obj
   * @param {string} obj.url
   * @param {string} obj.cloudUserName
   * @param {string} obj.cloudPassword
   * @param {string} obj.terminalUUID
   * @param {string} obj.tokenLocation
   */
  constructor(obj = { url, cloudUserName, cloudPassword, terminalUUID, tokenLocation }) {
    this.url = obj.url
    this.cloudUserName = obj.cloudUserName
    this.cloudPassword = obj.cloudPassword
    this.terminalUUID = obj.terminalUUID
    this.tokenLocation = obj.tokenLocation
    this.token = null
  }

  /**
   * Turn on the miner
   * @param {Miner} miner
   */
  switchOn(miner) {
    return switchOnOff(this, miner, true)
  }

  /**
   * Turn off the miner
   * @param {Miner} miner
   */
  switchOff(miner) {
    return switchOnOff(this, miner, false)
  }

  /**
   * Turn off, and turn on after specified interval
   * @param {Miner} miner
   * @param {number} interval
   */
  reset(miner, interval = 3) {
    return new Promise((resolve, reject) => {
      this.switchOff(miner)
        .then(() => {
          setTimeout(() => {
            this.switchOn(miner)
              .then(() => resolve())
              .catch(err => reject(err))
          }, interval * 1000);
        })
        .catch(err => resolve(err))
    })
  }

}

const protocol = 'https'

/**
 *
 * @param {tplink} tplink
 * @param {string} token
 * @return {Promise}
 */
const isValidToken = (tplink, token) => {
  const endpoint = url.format({
    protocol,
    host: tplink.url,
    query: { token: token.toString() }
  })
  return new Promise((resolve, reject) => {
    response = request.post(endpoint, {
      body: JSON.stringify({ method: 'getDeviceList' })
    }).then(result => {
      result = JSON.parse(result)
      if (result.error_code !== 0) {
        return reject(new Error(result.msg))
      }
      return resolve(true)
    }).catch(err => reject(err))
  })
}

/**
 *
 * @param {tplink} tplink
 * @return {Promise}
 */
const generateToken = (tplink) => {
  let body = {
    method: 'login',
    params: {
      appType: 'Kasa_Android',
      cloudUserName: tplink.cloudUserName,
      cloudPassword: tplink.cloudPassword,
      terminalUUID: tplink.terminalUUID
    }
  }
  body = JSON.stringify(body)
  const endpoint = url.format({
    protocol,
    host: tplink.url
  })

  console.info('Generating new token...')

  return new Promise((resolve, reject) => {
    const response = request.post(endpoint, {
      body: body
    })
      .then(value => {
        value = JSON.parse(value)
        let start = value.result.token.length - 6
        let end = value.result.token.length
        let fakeToken = `xxxxxxxx-xxxxxxxxxxxxxxxx${value.result.token.slice(start, end)}`
        console.info(`New token generated: ${fakeToken}`)
        return resolve(value.result.token)
      })
      .catch(err => {
        console.log('Error?')
        console.log(err)
        reject(err)
      })
  })
}

/**
 *
 * @param {tplink} Tplink
 * @return {Promise}
 */
const getValidToken = (tplink) => {
  return new Promise((resolve, reject) => {
    if (tplink.token) {
      isValidToken(tplink.token)
        .then((token) => resolve(token))
        .catch(() => {
          return generateToken(tplink)
            .then(token => resolve(token))
            .catch(err => reject(err))
        })
    } else {
      return generateToken(tplink)
        .then(token => resolve(token))
        .catch(err => reject(err))
    }
  })
}

/**
 *
 * @param {tplink} tplink
 * @param {Miner} miner
 * @param {string} token
 */
const getDeviceId = (tplink, miner, token) => {
  return new Promise((resolve, reject) => {
    const endpoint = url.format({
      protocol,
      host: tplink.url,
      query: { token }
    })
    console.info(`Getting id device of ${miner.tplinkName}`)
    request.post(endpoint, {
      body: JSON.stringify({ method: 'getDeviceList' })
    })
      .then(result => {
        result = JSON.parse(result)
        if (result.error_code !== 0) return reject(result)
        result.result.deviceList.forEach(device => {
          if (device.alias === miner.tplinkName) {
            console.info(`DeviceId: ${device.deviceId}`)
            return resolve(device.deviceId)
          }
        })
        reject(new Error(`No devices id with name ${miner.tplinkName} found`))
      })
      .catch(err => reject(err))
  })
}

/**
 *
 * @param {*} tplink
 * @param {*} miner
 * @param {*} token
 * @param {*} deviceId
 * @param {boolean} state
 */
const switchMiner = (tplink, miner, token, deviceId, state) => {
  state = state === true ? 1 : 0

  return new Promise((resolve, reject) => {
    const endpoint = url.format({
      protocol,
      host: tplink.url,
      query: { token }
    })

    let body = {
      method: 'passthrough',
      params: {
        deviceId: deviceId,
        requestData: JSON.stringify( {"system":{"set_relay_state":{"state": state }}} )
      }
    }

    body = JSON.stringify(body, {}, 2)

    request.post(endpoint, {
      body: body
    })
      .then(result => {
        result = JSON.parse(result)
        if (result.error_code !== 0) return reject(result)
        let switchMode = state === 1 ? 'on' : 'off'
        console.info(`Switched ${switchMode} ${miner.tplinkName} [${miner.ethosName}]`)
        resolve()
      })
      .catch(err => reject(err))
  })
}

/**
 *
 * @param {*} Tplink
 * @param {*} miner
 * @param {boolean} state
 */
const switchOnOff = (tplink, miner, state) => {
  return new Promise((resolve, reject) => {
    let token = ''
    getValidToken(tplink)
      .then(tok => {
        token = tok
        return getDeviceId(tplink, miner, token)
      })
      .then(deviceId => switchMiner(tplink, miner, token, deviceId, state))
      .then(() => resolve())
      .catch(err => reject(err))
  })
}

module.exports = Tplink
