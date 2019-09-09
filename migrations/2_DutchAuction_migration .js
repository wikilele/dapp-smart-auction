
const LinearDecreasingStrategy = artifacts.require("LinearDecreasingStrategy");
const DutchAuction = artifacts.require("DutchAuction");


module.exports = function(deployer, network, accounts) {

  const _reservePrice = 1;  // 1000000000000000000   
  const _initialPrice = 5;  // 5000000000000000000
  const _openedForLength = 8;
  const _seller = "0x889F40512A8E749B4De944B2deAF1B01F4CA4d17";
  const miningRate = 300;

  deployer.deploy(LinearDecreasingStrategy).then(function(){
    return deployer.deploy(DutchAuction, _reservePrice, _initialPrice, _openedForLength, _seller, LinearDecreasingStrategy.address, miningRate); 
  });
  

};
