// Node.JS 8 or greater
const Web3 = require('web3')
const {
  NonceTxMiddleware, SignedTxMiddleware, Client,
  Contract, Address, LocalAddress, CryptoUtils
} = require('loom-js')
const LoomTruffleProvider = require('loom-truffle-provider')
const fs = require('fs')
const conf = require('./config')

const privateKeyStr = fs.readFileSync('./private_key', 'utf-8')
const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr)
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

var simpleErrorJson = JSON.parse(fs.readFileSync('./build/contracts/SimpleError.json', 'utf8'));

const loomTruffleProvider = new LoomTruffleProvider(conf.chainId, conf.url + "/rpc", conf.url + "/query", privateKey)
const loomProvider = loomTruffleProvider.getProviderEngine()

// The address for the caller of the function
const from = LocalAddress.fromPublicKey(publicKey).toString()
console.log(from)
const address = Web3.utils.toChecksumAddress(from)
console.log(address)
// Instantiate web3 client using LoomProvider
const web3 = new Web3(loomProvider)

const contractAddress = conf.contractAddress
// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(simpleErrorJson.abi, contractAddress, {from});

(async function (){
   try {
     const tx = await contract.methods.err().send({from})
     console.log(tx)
   } catch(err) {
     console.log("THIS")
     console.log(err)
   }
})();
