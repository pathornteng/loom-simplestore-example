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

const privateKeyStr = "DceVrAXNSjxFHjM5L7aO6WQLKagBA0JhdnSleN/5+SNfXeQYrbblPcX4YHCdynVnrmzCFXej6N3/OUxNGjKhrQ=="
const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr);
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey);

const callerAddr = new Address("default", LocalAddress.fromPublicKey(publicKey))
console.log(callerAddr.toString())
