
const VickreyAuction = artifacts.require("VickreyAuction");


module.exports = function(deployer, network, accounts) {

  const _reservePrice = 2;  
  const _commitmentPhaseLength = 3;
  const _withdrawalPhaseLength = 2;
  const _openingPhaseLength = 3;
  const _depositRequired = 4;  
  
  const _seller = "0x889F40512A8E749B4De944B2deAF1B01F4CA4d17";
  const miningRate = 300;

  return deployer.deploy(VickreyAuction, _reservePrice, _commitmentPhaseLength,_withdrawalPhaseLength, _openingPhaseLength,_depositRequired, _seller, miningRate); 


};
