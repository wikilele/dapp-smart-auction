App = {

    provider : null,
    url: 'http://localhost:8545',

    initProvider : function() {

        // connecting to the provider
        if(typeof web3 != 'undefined') { // Check whether exists a provider, e.g Metamask
            // connecting to Metamask
            App.provider = new ethers.providers.Web3Provider(web3.currentProvider); 
            try {
                // Permission popup
                ethereum.enable().then(async() => { console.log("DApp connected " );});
            }
            catch(error) { console.log(error); }
        } else { // Otherwise, create a new local instance of Web3
            let currentProvider = new web3.providers.HttpProvider(App.url);
            App.provider = new ethers.providers.Web3Provider(currentProvider);
        }
    },
}

class Auction {
    constructor(type){
        this.type = type // DutchAuction or VickreyAuction
        this.contract = null;
        this.contractAddress = null;
        this.objectDescription = null;
    }

    async getContractFactory(signer){
        // getting the json
        let auctionJSON = await $.getJSON( this.type + ".json");

        // Create an instance of a Contract Factory
        return  new ethers.ContractFactory( auctionJSON.abi, auctionJSON.bytecode, signer);
     
    }

    deploy(){
        throw "This method needs to be redefined in the subclasses";
    }

    async acceptEscrow(){
        await this.contract.acceptEscrow();
    }

    async refuseEscrow(){
        await this.contract.refuseEscrow();
    }

    async concludeEscrow(){
        await this.contract.concludeEscrow();
    }

    getSeller(){
        return this.contract.getSeller();
    }

    getReservePrice(){
        return this.contract.getReservePrice();
    }

    async getGracePeriod(){
        return await this.contract.getGracePeriod();
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

    async deploy(signer){
        // deploying the choosen strategy
        let decreasingStrategyJSON = await $.getJSON( this.type + "DecreasingStrategy.json");

        let decreasingStrategyFactory = new ethers.ContractFactory( decreasingStrategyJSON.abi, decreasingStrategyJSON.bytecode, signer );
            
        this.strategy = await decreasingStrategyFactory.deploy();
            
        await this.strategy.deployed();
    }

}

class DutchAuction extends Auction{
    constructor(){
        super("DutchAuction");
    }

    async deploy(signer,_reservePrice, _initialPrice, _openedForLength, _seller,  decreasingStrategyAddress, miningRate){
        // deploying the DutchAuction
        let factory = await this.getContractFactory(signer);

        _reservePrice = ethers.utils.parseEther(_reservePrice);
        _initialPrice = ethers.utils.parseEther(_initialPrice);
        this.contract = await factory.deploy(_reservePrice, _initialPrice, _openedForLength, _seller,  decreasingStrategyAddress, miningRate);

        console.log(this.contract.address);
        this.contractAddress = this.contract.address;

        // The contract is NOT deployed yet; we must wait until it is mined
        await this.contract.deployed()
        
    }

    // bidding a value to the Auction
    async bid(bidValue) {
        let overrides = {
            gasLimit: 900000, // value based on the gas estimation done in the final-term
            value: ethers.utils.parseEther(bidValue)
        };

        await this.contract.bid(overrides);

    }

    getInitialPrice(){
        return this.contract.getInitialPrice();
    }

    async getCurrentPrice(){
        return await this.contract.getCurrentPrice();
    }

    async getOpenedFor(){
        return await this.contract.getOpenedFor();
    }
}

class VickreyAuction extends Auction{
    constructor(){
        super("VickreyAuction");
    }

    async deploy(signer, _reservePrice, _commitmentPhaseLength, _withdrawalPhaseLength, _openingPhaseLenght, _depositRequired, _seller, miningRate){
        // deploying the DutchAuction
        let factory = await this.getContractFactory(signer);

        _reservePrice = ethers.utils.parseEther(_reservePrice);
        _initialPrice = ethers.utils.parseEther(_depositRequired);
        this.contract = await factory.deploy(_reservePrice, _commitmentPhaseLength, _withdrawalPhaseLength, _openingPhaseLenght, _depositRequired, _seller, miningRate);

        console.log(this.contract.address);
        this.contractAddress = this.contract.address;

        // The contract is NOT deployed yet; we must wait until it is mined
        await this.contract.deployed()
    }

    async commitBid(bid, nonce, depositRequired){
        let overrides = {
            gasLimit: 30000, // value based on the gas estimation done in the final-term
            value: ethers.utils.parseEther(depositRequired)
        };
        // we use the utility provided by the contract so that we are sure that the parameters are passes correctly to the function
        let envelop = await this.contract.doKeccak(bid,nonce);

        await this.contract.commitBid(envelop,overrides);
    }

    async withdraw(){
        await this.contract.withdraw();
    }

    async open(nonce, bid){
        let overrides = {
            gasLimit: 30000, // value based on the gas estimation done in the final-term
            value: ethers.utils.parseEther(bid)
        };

        await this.contract.open(nonce,overrides);
    }

    async finalize(){
        await this.contract.finalize();
    }

    async getDepositRequired(){
        return await this.contract.getDepositRequired();
    }

    async getCommitmentPhaseLength(){
        return await this.contract.getCommitmentPhaseLength();
    }

    async getWithdrawalPhaseLength(){
        return await this.getWithdrawalPhaseLength();
    }

    async getOpeningPhaseLength(){
        return await this.getOpeningPhaseLength();
    }
}

class User{
    constructor(){
        this.pubKey = null;
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


// called when the window loads
$(window).on('load', function () {
    App.initProvider();
});
