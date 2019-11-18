// Node.JS 8 or greater
const Web3 = require('web3')
const {
  NonceTxMiddleware, SignedTxMiddleware, Client,
  Contract, Address, LocalAddress, CryptoUtils
} = require('loom-js')
const LoomTruffleProvider = require('loom-truffle-provider')
const fs = require('fs')
const conf = require('./config')

//const privateKeyStr = fs.readFileSync('./private_key', 'utf-8')
//const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr)
//const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

const privateKey = CryptoUtils.generatePrivateKey()
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

var simpleStoreJson = JSON.parse(fs.readFileSync('./build/contracts/SimpleTestContract.json', 'utf8'));

const loomTruffleProvider = new LoomTruffleProvider(conf.chainId, conf.url + "/rpc", conf.url + "/query", privateKey)
const loomProvider = loomTruffleProvider.getProviderEngine()

// The address for the caller of the function
const from = LocalAddress.fromPublicKey(publicKey).toString()
console.log(from)
// Instantiate web3 client using LoomProvider
const web3 = new Web3(loomProvider)

const contractAddress = conf.contractAddress
// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(simpleStoreJson.abi, contractAddress, {from});
//console.log(contract)
function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
web3eth = new Web3(new Web3.providers.WebsocketProvider(`ws://localhost:46658/eth`));
(async function (){
  try {
    const filt = web3eth.eth.filter()
    console.log(filt)
    const sub = web3eth.eth.subscribe('logs', {
      address: contractAddress,
      //fromBlock: 1,
  }, function (error, result) {
      console.log(error,result)
  }).on("data", function(log){
    console.log(log);
})
.on("changed", function(log){
    console.log("changeeeeeeeeeeeeeeee=========>")
    console.log(log)
});;

    console.log(filter)
    let tx = await contract.methods.set(22222).send()
    console.log(tx)
    tx = await contract.methods.set(22222).send()
    tx = await contract.methods.set(22222).send()
    tx = await contract.methods.set(22222).send()
    tx = await contract.methods.set(22222).send() 
    
  } catch(err) {
    console.log(err)
  }
})();
