const { readFileSync } = require('fs')
const LoomTruffleProvider = require('loom-truffle-provider')
const conf = require('./config')

const chainId    = conf.chainId
const writeUrl   = conf.url + "/rpc"
const readUrl    = conf.url + "/query"
const privateKey = readFileSync('./privatekey', 'utf-8')

console.log(conf)

const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)

module.exports = {
  networks: {
    loom_dapp_chain: {
      provider: loomTruffleProvider,
      network_id: '*'
    }
  },
  compilers: {
    solc: {
      version: "0.5.0",
    },
  },
}
