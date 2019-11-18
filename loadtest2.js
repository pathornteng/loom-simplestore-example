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

const privateKey = CryptoUtils.generatePrivateKey()
console.log(privateKey)
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

var simpleTestJSON = JSON.parse(
  fs.readFileSync("./build/contracts/LoadTestContract.json", "utf8")
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
   for(var i=0; i<30; i++) {
     contract.methods.storageConsumption(300).send().then(tx => {
       console.log(tx)
     })
   } 
   //console.time("MyTimer");
   //const tx = await contract.methods.storageConsumption(300).send()
   //console.timeEnd("MyTimer");
   //console.log(tx)
  
    
  } catch(err) {
    console.log("should not revert", err);
  }
  timeout();
}

function timeout() {
  setTimeout(hello,5000);
}

(async function () {
  await hello();
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
