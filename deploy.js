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
const contract = new web3.eth.Contract(simpleStoreJson.abi, null, { data: simpleStoreJson.bytecode });


(async function (){
  try {
    var result = contract.deploy().send({
      from: from,
      gasPrice: 0, 
      gas: 0,
      value: 10000,
    }).on('error', (error) => {
      console.log(`Error deploying contract ${error}`);
   }).on('transactionHash', (transactionHash) => {
      console.log(`Successfully submitted contract creation. Transaction hash: ${transactionHash}`); 
   }).on('receipt', (receipt) => {
      console.log(`Receipt after mining with contract address: ${receipt.contractAddress}`); 
      console.log(`Receipt after mining with events: ${JSON.stringify(receipt.events, null, 2)}`); 
   }).on('confirmation', (confirmationNumber, receipt) => { 
       console.log(`Confirmation no. ${confirmationNumber} and receipt for contract deployment: `, receipt); 
   })
    console.log(result)
  } catch(err) {
    console.log(err)
  }
})();
