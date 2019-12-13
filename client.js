// Node.JS 8 or greater
const Web3 = require("web3");
const {
  SpeculativeNonceTxMiddleware,
  SignedTxMiddleware,
  Client,
  Contract,
  Address,
  LocalAddress,
  CryptoUtils,
  LoomProvider
} = require("loom-js");
const fs = require("fs");
const conf = require("./config");

//const privateKeyStr = fs.readFileSync("./private_key", "utf-8");
//const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr);
//const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
const privateKey = CryptoUtils.generatePrivateKey()
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

const EthereumTx = require('ethereumjs-tx').Transaction

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

var simpleTestJSON = JSON.parse(
  fs.readFileSync("./build/contracts/SimpleTestContract.json", "utf8")
);

var client = new Client(
  conf.chainId,
  conf.url + "/websocket",
  conf.url + "/queryws"
);
client.on("error", msg => {
  console.error("Error on connect to client", msg);
  console.warn("Please verify if loom command is running");
});
const setupMiddlewareFn = function (client, privateKey) {
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
  return [
    new SpeculativeNonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ];
};
var loomProvider = new LoomProvider(client, privateKey, setupMiddlewareFn);

// The address for the caller of the function
const from = LocalAddress.fromPublicKey(publicKey).toString();
// Instantiate web3 client using LoomProvider
const web3 = new Web3(loomProvider);
const web3js = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:46658/eth"));

const contractAddress = conf.contractAddress;
// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(simpleTestJSON.abi, contractAddress, {
  from
});

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
var total = 1;
async function hello() {
  try {
    var value = await contract.methods.get().call()
    console.log(value)
    //await contract.methods.err(5).send()
    contract.methods.set(7555577).send().then()
    let tx = await contract.methods.err(20).send()
    console.log(tx)
    //await contract.methods.close().send()
    // const start = total;
    // for(var i=start; i<start + 10; i++){
    //   total++
    //   tx = contract.methods.addUser(i, 100, makeid(50)).send()
    // }
    // wait(1000)
    // for(var i=start; i<start + 10; i++) {
    //   const value = await contract.methods.getUser(i).call()
    //   console.log(value)
    
    // }
    // wait(5000)
    
  } catch (err) {
    console.log("should not revert", err);
  }
  //timeout();
}

function timeout() {
  setTimeout(hello, 1000);
}

(async function () {
  timeout();
})();


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
