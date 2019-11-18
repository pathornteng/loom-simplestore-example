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
  fs.readFileSync("./build/contracts/SimpleEvent.json", "utf8")
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
//console.log(contract)

async function doThings() {
  try {
    // contract.events.allEvents()
    // .on('data', (event) => {
    //   //console.log(event);
    // })
    // .on('error', console.error);
    // // contract.events.NewValueSet({}, (err, event) => {
    // //   console.log(err, event)
    // // })
    // const eventJsonInterface = Web3.utils._.find(
    //   contract._jsonInterface,
    //   o => o.name === 'NewValueSet' && o.type === 'event',
    // )
    const web3js = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
    web3js.eth.subscribe('logs', {
                address: contractAddress,
                topics:["0x8cab9942fff2e8f8ea5accf1a1f84816f27c51f4c4287b5965f888d08189bae7"]
            }, function (error, result) {
                if (!error) {
                    console.log("0x8cab9942fff2e8f8ea5accf1a1f84816f27c51f4c4287b5965f888d08189bae7", result);
                } 
                console.log(error)
            }); 
    web3js.eth.subscribe('newBlockHeaders', function (error, blockHeader) {
  if (error) console.log(error)
  console.log(blockHeader)
})
  .on('data', function (blockHeader) {
    // alternatively we can log it here
    console.log(blockHeader)
  })
    // web3js.eth.subscribe('logs', {
    //             address: contractAddress,
    //             topics:["0xb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b"]
    //         }, function (error, result) {
    //             if (!error) {
    //                 console.log("0xb922f092a64f1a076de6f21e4d7c6400b6e55791cc935e7bb8e7e90f7652f15b", result);
    //             }
    //             console.log(error)
    //         });
    contract.getPastEvents('AnotherEventSet',{ 
//      fromBlock: 0,
//      toBlock: 'latest' 
    },function(err, ev) {
      console.log("HERERE")
      console.log(err)
      console.log(ev)
    });
    contract.methods.set(1).send();
    contract.methods.set(1).send();
    var txs = await contract.methods.set(1).send();
    txs = await contract.methods.set(1).send();
    txs = await contract.methods.set(1).send();
    //console.log(txs.events.NewValueSet)
    //console.log(Object.keys(txs.events).length)
    //txs = await contract.methods.set(2).send();
  } catch (err) {
    console.log("should not revert", err);
  }



}

(async function () {
  doThings();
})();
