App = {

    provider : null,
    url: 'http://localhost:8545',

    initProvider : function() {

        // connecting to the provider
        let currentProvider = new web3.providers.HttpProvider(App.url);

        App.provider = new ethers.providers.Web3Provider(currentProvider);

    },
}

class Auction {
    constructor(type){
        this.type = type // DutchAuction or VickreyAuction
        this.contract = null;
        this.contractAddress = null;
        this.objectDescription = null;
    }

    async getContractFactory(wallet){
        // getting the json
        let auctionJSON = await $.getJSON( this.type + ".json");

        // Create an instance of a Contract Factory
        return  new ethers.ContractFactory( auctionJSON.abi, auctionJSON.bytecode, wallet);
     
    }

    deploy(){
        throw "This method needs to be redefined in the subclasses";
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

class DecreasingStrategy{
    constructor(type){
        this.type = type; // Linear, Logarithmic, InverseLogarithmic
        this.strategy = null;
    }

    async deploy(wallet){
        // deploying the choosen strategy
        let decreasingStrategyJSON = await $.getJSON( this.type + "DecreasingStrategy.json");

        let decreasingStrategyFactory = new ethers.ContractFactory( decreasingStrategyJSON.abi, decreasingStrategyJSON.bytecode, wallet );
            
        this.strategy = await decreasingStrategyFactory.deploy();
            
        await this.strategy.deployed();
    }

}

class DutchAuction extends Auction{
    constructor(){
        super("DutchAuction");
    }

    async deploy(wallet,_reservePrice, _initialPrice, _openedForLength, _seller,  decreasingStrategyAddress, miningRate){
       
            let factory = await this.getContractFactory(wallet);

            _reservePrice = ethers.utils.parseEther(_reservePrice);
            _initialPrice = ethers.utils.parseEther(_initialPrice);
            this.contract = await factory.deploy(_reservePrice, _initialPrice, _openedForLength, _seller,  decreasingStrategyAddress, miningRate);

            console.log(this.contract.address);
            this.contractAddress = this.contract.address;

            // The contract is NOT deployed yet; we must wait until it is mined
            await this.contract.deployed()
        
            //AuctionHouse.auctionHouseContract. notifyNewAuction(AuctionHouse.dutchAuctionContract.address,"DutchAuction", AuctionHouse.objectDescription);  
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

class User{
    constructor(privateKey){
        this.wallet = new ethers.Wallet(privateKey, App.provider);
        this.auctionContract = null;
        this.auctionHouseContract = null;
    }

    registerToAuctionEvents(){
        throw "this function must be rimplemented by subclasses";
    }
    registerToAuctionHouseEvents(){
        throw "this function must be rimplemented by subclasses";
    }
}



// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        App.initProvider();
    });
});