var LoadTestContract = artifacts.require("./LoadTestContract.sol");

module.exports = function(deployer) {
  deployer.deploy(LoadTestContract,1000);
};
