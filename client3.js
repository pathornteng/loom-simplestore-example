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
// Instantiate web3 client using LoomProvider
const web3 = new Web3(loomProvider)

const contractAddress = conf.contractAddress
console.log(contractAddress)
// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(simpleStoreJson.abi, contractAddress, {from});
//console.log(contract)
(async function (){
  try {
    var value = await contract.methods.get().call()
    console.log(value)
    //await contract.methods.err(5).send()
    await contract.methods.set(6666).send()
    var value = await contract.methods.get().call()
    console.log(value)
    //let tx = await contract.methods.err(20).send()
    //console.log(tx)
    // const tx = await contract.methods.set(234).send()
    // console.log(tx)
    // //const count = await web3.eth.getTransaction(tx.transactionHash)
    // //console.log(count)
    // value = await contract.methods.get().call()
    // console.log(value)
  } catch(err) {
    console.log(err)
  }
})();
