// Node.JS 8 or greater
const Web3 = require('web3')
const {
  NonceTxMiddleware, SignedTxMiddleware, Client,
  Contract, Address, LocalAddress, CryptoUtils
} = require('loom-js')
const LoomTruffleProvider = require('loom-truffle-provider')
const fs = require('fs')
const conf = require('./config')

const privateKey = CryptoUtils.generatePrivateKey()
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

var simpleStoreJson = JSON.parse(fs.readFileSync('./build/contracts/SimpleStore.json', 'utf8'));

const loomTruffleProvider = new LoomTruffleProvider(conf.chainId, conf.url + "/rpc", conf.url + "/query", privateKey)
const loomProvider = loomTruffleProvider.getProviderEngine()

// The address for the caller of the function
const from = LocalAddress.fromPublicKey(publicKey).toString()

// Instantiate web3 client using LoomProvider
const web3 = new Web3(loomProvider)

const contractAddress = conf.contractAddress
// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(simpleStoreJson.abi, contractAddress, {from});

(async function (){
  try {
    const tx = await contract.methods.set(11111).send()
    console.log(tx)
    const value = await contract.methods.get().call()
    console.log(value)
  } catch(err) {
    console.log(err)
  }
})();
