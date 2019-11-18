// Node.JS 8 or greater
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const fs = require("fs");
const conf = require("./config");

var simpleTestJSON = JSON.parse(
  fs.readFileSync("./build/contracts/OuterEmitter.json", "utf8")
);

console.log(simpleTestJSON.abi)

const innerAddr = "0x8FDa47840B78A2b6866107BD6d68F79bc5A1AC98"
const contractAddress = "0xfDEb8f8B8d473a56F6A4b17043a803855D419930";
// Instantiate the contract and let it ready to be used
const contract = new web3.eth.Contract(simpleTestJSON.abi, contractAddress, {
  from: '0x23b859Ddb08D975b88486869EEF60cb64CC03C09'
});
async function hello() {
  const web3js = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:7545"));
  web3js.eth.subscribe('logs', {
  }, function (error, result) {
    if (!error) {
      console.log("0x8cab9942fff2e8f8ea5accf1a1f84816f27c51f4c4287b5965f888d08189bae7 **********>", result);
    }
    console.log(error)
  });
  web3js.eth.subscribe('newBlockHeaders', function (error, blockHeader) {
      if (error) console.log(error)
      console.log("HEADER ---------->",blockHeader)
    })
    .on('data', function (blockHeader) {
      // alternatively we can log it here
      console.log(blockHeader)
    })
  try {
    var txs = await contract.methods.setInner(innerAddr).send();
    console.log(txs)
    txs = await contract.methods.sendEvent(1).send();
    console.log(txs)
  } catch (err) {
    console.log("should not revert", err);
  }
  console.log("Send Txs");
  //timeout();
}

function timeout() {
  setTimeout(hello, 1000);
}

(async function () {
  timeout();
})();