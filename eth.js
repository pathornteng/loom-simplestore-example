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
keccak256 = require('js-sha3').keccak256;
const EthereumTx = require('ethereumjs-tx').Transaction
const privateKeyStr = fs.readFileSync("./private_key", "utf-8");
const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr);
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);
const fromAddr = LocalAddress.fromHexString("0x7262d4c97c7B93937E4810D289b7320e9dA82857")

const from = fromAddr.toString();

console.log("from", fromAddr.bytes)

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

let txParams = {
  nonce: '0x1', //expect nonce to be 1
  gasPrice: '', // gas price is always 0
  gasLimit: '0xFFFFFFFFFFFFFFFF', // gas limit right now is max.Uint64
  to: "0x7262d4c97c7B93937E4810D289b7320e9dA82857",
  value: '',
  data: '', // set(1111)
}

//console.log(from)

let tx = new EthereumTx(txParams)
let expectedTxHash = Buffer.from(tx.hash()).toString('hex')
console.log(expectedTxHash)

let txHashBytes = Buffer.from(tx.hash())
let addrBytes = Buffer.from(fromAddr.bytes)
var arr = [txHashBytes, addrBytes];
let newTxHashBytes = Buffer.concat(arr)
console.log(keccak256(newTxHashBytes).toString('hex'))
//0x60fe47b10000000000000000000000000000000000000000000000000000000000000457
//0xFFFFFFFFFFFFFFFF

// // The second parrmameter is not necessary if these values are used
// const tx = new EthereumTx(txParams)

// console.log(toHexString(tx.hash()))

// var serializedTx = tx.serialize();

// // console.log(serializedTx.toString('hex'));
// // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

// web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
// .on('receipt', console.log);
//const serializedTx = tx.serialize()