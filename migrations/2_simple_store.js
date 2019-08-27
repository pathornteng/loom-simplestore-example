var SimpleTestContract = artifacts.require("./SimpleTestContract.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleTestContract,1000);
};
