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
  fs.readFileSync("./build/contracts/OuterEmitter.json", "utf8")
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

const contractAddress = conf.contractAddress;
// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(simpleTestJSON.abi, contractAddress, {
  from
});

async function hello() {
  var d = new Date();
  var n = d.getTime();

  contract.events.allEvents()
    .on('data', (event) => {
      console.log(event);
    })

  console.log(await contract.methods.setInner('0x09DAD403d85f4d1D360386E8f4ca1774c24476c5').send())
  console.log(await contract.methods.sendEvent(1).send())

  console.log("Send Txs");
}

function timeout() {
  setTimeout(hello, 1000);
}

(async function () {
  timeout();
})();
