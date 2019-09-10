// variable storing the auctionhouse (user) informations
let auctionhouse = null;

class AuctionHouse extends User {
    constructor() {
        super();
        this.decreasingStrategy = null;
    }

    // deploying the Auction House contract
    async init() {
        let auctionHouseJSON = await $.getJSON("AuctionHouse.json");
        let auctionHouseFactory = new ethers.ContractFactory(auctionHouseJSON.abi, auctionHouseJSON.bytecode, App.provider.getSigner());

        this.auctionHouseContract = await auctionHouseFactory.deploy();
        await this.auctionHouseContract.deployed();

        console.log(this.auctionHouseContract.address);

        // diplaying the contract address
        auctionhouseUI.setAuctionHouseAddress(this.auctionHouseContract.address);

        // sending the auction house address to the server so that it can be taken by the bidder and the seller
        $.ajax({
            type: "POST",
            url: "auctionhouse/address",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ "contractAddress": this.auctionHouseContract.address })
        })

        return this.registerToAuctionHouseEvents();
    }

    // deploying the Dutch Auction
    async initDutchAuction(strategy, _reservePrice, _initialPrice, _openedForLength, _seller, miningRate) {

        this.decreasingStrategy = new DecreasingStrategy(strategy);
        await this.decreasingStrategy.deploy(App.provider.getSigner());

        let objdescr = this.auctionContract.objectDesciption;
        this.auctionContract = new DutchAuction();
        this.auctionContract.objectDesciption = objdescr;
        
        await this.auctionContract.deploy(App.provider.getSigner(), _reservePrice, _initialPrice, _openedForLength, _seller, this.decreasingStrategy.strategy.address, miningRate);

        this.registerToAuctionEvents();

        this.auctionHouseContract.notifyNewAuction(this.auctionContract.contractAddress, this.auctionContract.type, this.auctionContract.objectDesciption);
    }

    async initVickreyAuction(_reservePrice, _commitmentPhaseLength,_withdrawalPhaseLength,_openingPhaseLength, _depositReuired, _seller, miningRate){
        let objdescr = this.auctionContract.objectDesciption;
        this.auctionContract = new VickreyAuction();
        this.auctionContract.objectDesciption = objdescr;
        
        await this.auctionContract.deploy(App.provider.getSigner(), _reservePrice, _commitmentPhaseLength,_withdrawalPhaseLength,_openingPhaseLength, _depositReuired, _seller, miningRate);

        this.registerToAuctionEvents();
        this.registerToVickreyAuctionEvents();

        this.auctionHouseContract.notifyNewAuction(this.auctionContract.contractAddress, this.auctionContract.type, this.auctionContract.objectDesciption);
    }

    // subscribing to the Auction House contract's events
    registerToAuctionHouseEvents() {

        this.auctionHouseContract.on("NewSellerSubscribed", (sellerAddress) => {
            auctionhouseUI.newSellerSubscribed(sellerAddress);
        });

        this.auctionHouseContract.on("NewBidderSubscribed", (bidderAddress) => {
            auctionhouseUI.newBidderSubscribed(bidderAddress);
        });

        this.auctionHouseContract.on("AuctionSubmitted", (sellerAddress, objectDescription) => {
            this.auctionContract = new Auction("");
            this.auctionContract.objectDesciption = objectDescription;

            auctionhouseUI.newAuctionSubmitted(sellerAddress, objectDescription);

        });

        this.auctionHouseContract.on("NewAuction", (auctionAddress, auctionName, objectDesciption) => {
            auctionhouseUI.auctionDeployedSuccessfully(auctionAddress, auctionName, objectDesciption);
        });
    }

    // subscribing to the Auction events
    registerToAuctionEvents() {
        this.auctionContract.contract.on("Winner", (winnerAddress, bid) => {
            auctionhouseUI.notifyWinner(winnerAddress, bid);
        });

        this.auctionContract.contract.on("NewBlock", (blockNumber) => {
            appUI.newBlock(blockNumber);
        });

        this.auctionContract.contract.on("EscrowAccepted", (address) => {
            if (address.toLowerCase() == this.pubKey)
                appUI.escrowAccepted();
        });

        this.auctionContract.contract.on("EscrowRefused", (address) => {
            if (address.toLowerCase() == this.pubKey)
                appUI.escrowRefused();
        });

        this.auctionContract.contract.on("EscrowClosed", () => {
            appUI.escrowClosed();
        });
    }

    registerToVickreyAuctionEvents(){
        this.auctionContract.contract.on("CommittedEnvelop", (bidderAddress) => {
            console.log(bidderAddress);
        });

        this.auctionContract.contract.on("Withdraw", (bidderAddress) => {
            console.log(bidderAddress);
        });
        this.auctionContract.contract.on("Open", (bidderAddress, value) => {
            console.log("Open " + bidderAddress + " vaule " + value);
        });

        this.auctionContract.contract.on("FirstBid", (bidderAddress, value) => {
            console.log("First bid" + bidderAddress + " vaule " + value);
        });

        this.auctionContract.contract.on("SecondBid", (bidderAddress, value) => {
            console.log("second bid" + bidderAddress + " vaule " + value);
        });
    }


    async destroyContracts() {
        await this.auctionContract.contract.destroyContract();

        await this.decreasingStrategy.strategy.destroyContract();
        await this.auctionHouseContract.destroyContract();
    }
}

// called when the window loads
$(window).on('load', function () {
    auctionhouse = new AuctionHouse();
});






