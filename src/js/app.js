App = {

    contracts : {},
    provider : null,
    url: 'http://localhost:8545',

    initProvider : function() {

        // connecting to the provider
        let currentProvider = new web3.providers.HttpProvider(App.url);

        App.provider = new ethers.providers.Web3Provider(currentProvider);

    },
    // function that can be called by all the parties
    acceptEscrow: function(contract){
        contract.acceptEscrow();
    },

    refuseEscrow: function(contract){
        contract.refuseEscrow();
    },

    concludeEscrow: function(contract){
        contract.concludeEscrow();
    },

    getSeller: function(contract){
        contract.getSeller().then((seller) =>{
            console.log("The seller is  " + seller);
        });
    },
    getReservePrice: function(contract){
        contract.getReservePrice().then((price) =>{
            console.log("The reserve price is  " + price.toString() );
        });
    },

    getInitialPrice: function(contract){
        contract.getInitialPrice().then((price) => {
            console.log("The initial price is  " + price.toString());
        });
    },

    getCurrentPrice: function(contract){
        contract.getCurrentPrice().then((price) => {
            console.log("The current price is  " + price.toString());
        });
    },

    getOpenedFor: function(contract){
        contract.getOpenedFor().then((openedFor) => {
            console.log("The auction will be opened for  " + openedFor.toString());
        });
    },
    addBlock: function(contract){
        contract.addBlock();

    }
}

class Auction {
    constructor(type){
        this.type = type // DutchAuction or VickreyAuction
        this.contract = null;
        this.contractAddress = null;
    }

    deploy(){
        (async function(){
            // getting the json
            let auctionJSON = await $.getJSON( type + ".json");

            // Create an instance of a Contract Factory
            let factory = new ethers.ContractFactory( auctionJSON.abi, auctionJSON.bytecode, AuctionHouse.wallet);

        AuctionHouse.dutchAuctionContract = await factory.deploy(ethers.utils.parseEther(_reservePrice), ethers.utils.parseEther(_initialPrice), _openedForLength, _seller,  AuctionHouse.decreasingStrategyContract.address, miningRate);

        console.log(AuctionHouse.dutchAuctionContract.address);

        // The contract is NOT deployed yet; we must wait until it is mined
        await AuctionHouse.dutchAuctionContract.deployed()
        
        AuctionHouse.auctionHouseContract. notifyNewAuction(AuctionHouse.dutchAuctionContract.address,"DutchAuction", AuctionHouse.objectDescription);

        return AuctionHouse.registerEvents();
        });
        
    }

    acceptEscrow(){
        this.contract.acceptEscrow();
    }

    refuseEscrow(){
        this.contract.refuseEscrow();
    }

    concludeEscrow(){
        contract.concludeEscrow();
    }

    getSeller(){
        return this.contract.getSeller();
    }

    getReservePrice(){
        return this.contract.getReservePrice();
    }

    addBlock(){
        this.contract.addBlock();
    }
     
}

class DutchAuction extends Auction{
    constructor(){
        super("DutchAuction");
    }


    getReservePrice(){
        return this.contract.getReservePrice();
    }

    getInitialPrice(){
        return this.contract.getInitialPrice();
    }

    getCurrentPrice(){
        return this.contract.getCurrentPrice();
    }

    getOpenedFor(){
        return this.contract.getOpenedFor();
    }
}

// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        App.initProvider();
    });
});