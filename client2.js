// Node.JS 8 or greater
const Web3 = require('web3')
const fs = require('fs')

var simpleErrorJson = JSON.parse(fs.readFileSync('./build/contracts/SimpleError.json', 'utf8'));
const conf = require('./config')

const etherUrl = "http://localhost:7545";
let web3 = new Web3(new Web3.providers.HttpProvider(etherUrl));

(async function (){
  try {
    const from = await web3.eth.getAccounts()
    console.log(from[0])
    const contract = new web3.eth.Contract(simpleErrorJson.abi, conf.errorAddress, {from:from[0]});
    // Instantiate the contract and let it ready to be used
    const tx = await contract.methods.err().send({from:from[0]})
    console.log(tx)
  } catch(err) {
    console.log(err)
  }
})();
