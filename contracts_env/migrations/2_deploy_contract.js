   const NF_TOKEN_ENUM = artifacts.require("nf-token-enumerable");
  
  
   module.exports = function(deployer) {
     deployer.deploy(NF_TOKEN_ENUM);
  };
