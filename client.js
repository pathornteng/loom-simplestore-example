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

const privateKeyStr = fs.readFileSync("./private_key", "utf-8");
const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr);
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

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
const setupMiddlewareFn = function(client, privateKey) {
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
//console.log(contract)
function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}
async function hello() {
  var d = new Date();
  var n = d.getTime();

  // contract.methods
  //   .err()
  //   .send()
  //   .then()
  //   .catch(function(err) {
  //     if (!err.toString().includes("reverted")) {
  //       console.log("unexpected err:", err);
  //     }
  //   });
  // contract.methods
  //   .err()
  //   .send()
  //   .then()
  //   .catch(function(err) {
  //     if (!err.toString().includes("reverted")) {
  //       console.log("unexpected err:", err);
  //     }
  //   });
  // contract.methods
  //   .err()
  //   .send()
  //   .then()
  //   .catch(function(err) {
  //     if (!err.toString().includes("reverted")) {
  //       console.log("unexpected err:", err);
  //     }
  //   });

  //contract.methods.set(n).send().then().catch(function(err) { console.log("Should not have this 1", err) })
  try {
    await contract.methods.set(1111).send();
  } catch (err) {
    console.log("should not revert", err);
  }
  try {
    await contract.methods.set(3333).send();
  } catch (err) {
    console.log("should not revert", err);
  }
  //contract.methods.set(n+1).send().then().catch(function(err) { console.log("Should not have this 2", err) })
  // send three more successful txs without await
  //contract.methods.set(4444).send().then(tx => console.log(tx) ).catch(function(e) { console.log(err) })
  //contract.methods.set(5555).send().then(tx => console.log(tx) ).catch(function(e) { console.log(err) })
  //contract.methods.set(6666).send().then(tx => console.log(tx) ).catch(function(e) { console.log(err) })

  console.log("Send Txs");
  timeout();
}

function timeout() {
  setTimeout(hello, 100);
}

(async function() {
  timeout();
})();
