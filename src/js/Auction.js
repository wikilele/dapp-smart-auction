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

    async connect(signer, address){
        let c = await $.getJSON( this.type + ".json")
        this.contract = new ethers.Contract(address, c.abi, signer);
        console.log("connected");
    }
    
    deploy(){
        throw "This method needs to be redefined in the subclasses";
    }

    async destroy(){
        await this.contract.destroyContract();
    }

    registerToEvents(ui){
        this.contract.on("Winner", (winnerAddress, bid) => {
            ui.notifyWinner(winnerAddress, bid);
        });

        this.contract.on("NewBlock", (blockNumber) => {
            ui.newBlock(blockNumber);
        });

        this.contract.on("EscrowAccepted", (address) => {
            ui.escrowAccepted(address);
        });

        this.contract.on("EscrowRefused", (address) => {
            ui.escrowRefused(address);
        });

        this.contract.on("EscrowClosed", () => {
            ui.escrowClosed();
        });
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

    async destroy(){
        await this.strategy.destroyContract();
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

    registerToEvents(ui){
        super.registerToEvents(ui);

        // this is specific to DutchAuction
        this.contract.on("NotEnoughMoney", (bidderAddress, bidSent, actualPrice) => {
          ui.notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice);
        });
    }


    // bidding a value to the Auction
    async bid(bidValue) {
        let overrides = {
            gasLimit: 6000000, 
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
        _depositRequired = ethers.utils.parseEther(_depositRequired);
        this.contract = await factory.deploy(_reservePrice, _commitmentPhaseLength, _withdrawalPhaseLength, _openingPhaseLenght, _depositRequired, _seller, miningRate);

        console.log(this.contract.address);
        this.contractAddress = this.contract.address;

        // The contract is NOT deployed yet; we must wait until it is mined
        await this.contract.deployed()
    }

    registerToEvents(ui){
        super.registerToEvents(ui);

        this.contract.on("CommittedEnvelop", (bidderAddress) => {
            ui.notifyCommittedEnvelop(bidderAddress);
        });

        this.contract.on("Withdraw", (bidderAddress) => {
            ui.notifyWithdraw(bidderAddress);
        });
        this.contract.on("Open", (bidderAddress, value) => {
            ui.notifyOpen(bidderAddress,value);
        });

        this.contract.on("FirstBid", (bidderAddress, value) => {
            ui.notifyFirstBid(bidderAddress,value);
        });

        this.contract.on("SecondBid", (bidderAddress, value) => {
            ui.notifySecondBid(bidderAddress,value);
        });
    }

    async commitBid(bid, nonce, depositRequired){
        let overrides = {
            gasLimit: 50000, 
            value: ethers.utils.parseEther(depositRequired)
        };
        // we use the utility provided by the contract so that we are sure that the parameters are passes correctly to the function
        let envelop = await this.contract.doKeccak( ethers.utils.parseEther(bid),nonce);
        await this.contract.commitBid(envelop,overrides);
    }

    async withdraw(){
        await this.contract.withdraw();
    }

    async open(nonce, bid){
        let overrides = {
            gasLimit: 60000, 
            value: ethers.utils.parseEther(bid)
        };
        await this.contract.open(nonce,overrides);
    }

    async finalize(){
        let overrides = {
            gasLimit: 6000000
        };
        await this.contract.finalize(overrides);
    }

    async getDepositRequired(){
        return await this.contract.getDepositRequired();
    }

    async getCommitmentPhaseLength(){
        return await this.contract.getCommitmentPhaseLength();
    }

    async getWithdrawalPhaseLength(){
        return await this.contract.getWithdrawalPhaseLength();
    }

    async getOpeningPhaseLength(){
        return await this.contract.getOpeningPhaseLength();
    }
}

class AuctionHouse{
    constructor(){
        this.contract = null;
    }

    async deploy(signer){
        let auctionHouseJSON = await $.getJSON("AuctionHouse.json");
        let auctionHouseFactory = new ethers.ContractFactory(auctionHouseJSON.abi, auctionHouseJSON.bytecode, signer);

        this.contract = await auctionHouseFactory.deploy();
        await this.contract.deployed();

        console.log(this.contract.address);

        return this.contract.address;
    }

    async connect(signer, auctionHouseAddress){
        let c = await $.getJSON("AuctionHouse.json");
        
        this.contract = new ethers.Contract(auctionHouseAddress, c.abi, signer);
        console.log("connected to auction house");
    }

    async destroy(){
        await this.contract.destroyContract();
    }

    registerToEvents(ui){
        this.contract.on("NewSellerSubscribed", (sellerAddress) => {
            ui.newSellerSubscribed(sellerAddress);
        });
    
        this.contract.on("NewBidderSubscribed", (bidderAddress) => {
            ui.newBidderSubscribed(bidderAddress);
        });
    
        this.contract.on("AuctionSubmitted", (sellerAddress, objectDescription) => {  
            ui.newAuctionSubmitted(sellerAddress, objectDescription);
        });
    
        this.contract.on("NewAuction", (auctionAddress, auctionName, objectDesciption) => {
            ui.auctionDeployedSuccessfully(auctionAddress, auctionName, objectDesciption);
        });
    }

    async subscribeAsBidder(){
        await this.contract.subscribeAsBidder();
    }

    async subscribeAsSeller(){
        await this.contract.subscribeAsSeller();
    }

    submitAuction(objectDescription){
        this.contract.submitAuction(objectDescription);
    }

    notifyNewAuction(auctionAddress, auctionType, objectdescr){
        this.contract.notifyNewAuction(auctionAddress, auctionType, objectdescr);
    }
    
}