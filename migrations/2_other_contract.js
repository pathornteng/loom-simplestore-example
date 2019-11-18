var InnerEmitter = artifacts.require("./InnerEmitter.sol");
var OuterEmitter = artifacts.require("./OuterEmitter.sol");
var storeTest = artifacts.require('./StoreTestContract.sol');

module.exports = function(deployer) {
  deployer.deploy(InnerEmitter);
  deployer.deploy(OuterEmitter);
  deployer.deploy(storeTest);
};
