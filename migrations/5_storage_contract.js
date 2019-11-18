var SimpleEventContract = artifacts.require("./SimpleEvent.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleEventContract,1000);
};
