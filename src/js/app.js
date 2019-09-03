App = {
    contracts : {},
    provider : null,
    url: 'http://localhost:8545',

    init : function() {

        if(typeof web3 != 'undefined') { // Check whether exists a provider, e.g Metamask

            // connecting to Metamask
            let currentProvider = new web3.providers.HttpProvider('http://localhost:8545');

            App.provider = new ethers.providers.Web3Provider(currentProvider);
            //App.provider = new ethers.providers.Web3Provider(web3.currentProvider);
            
            try {
                // Permission popup
                ethereum.enable().then(async() => { console.log("DApp connected"); });
            }
            catch(error) { console.log(error); }

        } else {
            // let currentProvider = new web3.providers.HttpProvider('http://localhost:8545');
            // let web3Provider = new ethers.providers.Web3Provider(currentProvider);
        }
        
        return App.initContract();
    },

    initContract : function(){

        // Load the wallet to deploy the contract with
        let privateKey = "a0d9dab5fed44e095a2b021e2b4f87068b1d1488d9546eb6229a487f0885114c"; // from ganache
        let wallet = new ethers.Wallet(privateKey, App.provider);

        // Deployment is asynchronous, so we use an async IIFE
        (async function() {
            let linearDecreasingStrategy = await $.getJSON("LinearDecreasingStrategy.json");

            let decreasingStrategyFactory = new ethers.ContractFactory( linearDecreasingStrategy.abi, linearDecreasingStrategy.bytecode, wallet );
            console.log(decreasingStrategyFactory);
            let decreasingStrategyContract = await decreasingStrategyFactory.deploy();
            
            await decreasingStrategyContract.deployed();
            let dutchAuction = await $.getJSON("DutchAuction.json");

            // Create an instance of a Contract Factory
            let factory = new ethers.ContractFactory( dutchAuction.abi, dutchAuction.bytecode, wallet );
            
            const _reservePrice = 1;  // 1000000000000000000 
            const _initialPrice = 5;  // 5000000000000000000
            const _openedForLength = 8;
            const _seller = "0x889F40512A8E749B4De944B2deAF1B01F4CA4d17";
            const miningRate = 300;
            // Notice we pass in "Hello World" as the parameter to the constructor
            let contract = await factory.deploy(_reservePrice, _initialPrice, _openedForLength, _seller,  decreasingStrategyContract.address, miningRate);

            // The address the Contract WILL have once mined
            // See: https://ropsten.etherscan.io/address/0x2bd9aaa2953f988153c8629926d22a6a5f69b14e
            console.log(contract.address);
            // "0x2bD9aAa2953F988153c8629926D22A6a5F69b14E"
          
            // The contract is NOT deployed yet; we must wait until it is mined
            await contract.deployed()

            // Done! The contract is deployed.*/
            contract.on("AuctionCreated", (availableIn) => {
                console.log("Auction created!, available in " + availableIn);
            });

            contract.on("NewBlock", (blocknumber) => {
                console.log("Block number " + blocknumber);
            })
            
            contract.addBlock();
        })();

        //return App.listenForEvents();

    },


    getBalance: function(){

        let address = "0x1143cD29fa3B94d9A26C8a8A9398DCa4D49E5F81"
        App.provider.getBalance(address).then((balance) => {

            // balance is a BigNumber (in wei); format is as a sting (in ether)
            let etherString = ethers.utils.formatEther(balance);
        
            console.log("Balance: " + etherString);
        });
    }
}




$("#title").click(function(){
    App.getBalance();
});



// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        App.init();
    });
});