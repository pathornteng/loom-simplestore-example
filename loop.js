// Node.JS 8 or greater
const Web3 = require('web3')
const {
  SpeculativeNonceTxMiddleware,
  SignedTxMiddleware,
  Client,
  Contract,
  Address,
  LocalAddress,
  CryptoUtils,
  LoomProvider
} = require('loom-js')
const fs = require('fs')
const conf = require('./config')

const privateKeyStr = fs.readFileSync('./private_key', 'utf-8')
const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr)
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

var simpleStoreJson = JSON.parse(fs.readFileSync('./build/contracts/SimpleTestContract.json', 'utf8'));

var client = new Client(conf.chainId, conf.url + "/websocket", conf.url + "/queryws")
client.on('error', msg => {
  console.error('Error on connect to client', msg)
  console.warn('Please verify if loom command is running')
})
const setupMiddlewareFn = function (client, privateKey) {
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
  return [new SpeculativeNonceTxMiddleware(publicKey, client), new SignedTxMiddleware(privateKey)]
}
var loomProvider = new LoomProvider(client, privateKey, setupMiddlewareFn)

// The address for the caller of the function
const from = LocalAddress.fromPublicKey(publicKey).toString()
// Instantiate web3 client using LoomProvider
const web3 = new Web3(loomProvider)

const contractAddress = conf.contractAddress
// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(simpleStoreJson.abi, contractAddress, {
  from
});
//console.log(contract)
function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

(async function () {

  try {
    for (var i=0; i<100000; i++) {
      contract.methods.loop().send().then(tx => console.log(tx)).catch(function (e) {
        console.log(err)
      })
    }

  } catch (err) {}

})();