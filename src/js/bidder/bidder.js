// variable storing the bidder (user) informations
let bidder = null;

class Bidder extends User {
    constructor() {
        super();

    }

    // connecting to the AuctionHouse 
    async subscribeToAuctionHouse(auctionHouseAddress) {
        let c = await $.getJSON("AuctionHouse.json");

        this.auctionHouseContract = new ethers.Contract(auctionHouseAddress, c.abi, App.provider.getSigner());

        console.log("connected to auction house");

        this.registerToAuctionHouseEvents();
        
        try{
            await this.auctionHouseContract.subscribeAsBidder();
        }catch(err){
            // already subscribed
            appUI.notifyTransactionError("transaction reverted");
        }
    }

    // subscribing to the AuctionHouse's events
    registerToAuctionHouseEvents() {
        this.auctionHouseContract.on("NewBidderSubscribed", (bidderAddress) => {
            if (bidderAddress.toLowerCase() == this.pubKey)
                bidderUI.successfullySubscribed();
        });

        this.auctionHouseContract.on("NewAuction", (auctionAddress, auctionName, objectDesciption) => {
            this.auctionContract = new DutchAuction();
            this.auctionContract.objectDesciption = objectDesciption;
            this.auctionContract.contractAddress = auctionAddress;

            bidderUI.notifyNewAuction(auctionAddress, auctionName, objectDesciption);
        });
    }

    // connecting to the deployed contract
    async connectToContract() {
        let c = await $.getJSON("DutchAuction.json")
        this.auctionContract.contract = new ethers.Contract(this.auctionContract.contractAddress, c.abi, App.provider.getSigner());
        console.log("connected");

        return this.registerToAuctionEvents();
    }

    // subscribing to the Auction's events
    registerToAuctionEvents() {
        this.auctionContract.contract.on("Winner", (winnerAddress, bid) => {
            bidderUI.notifyWinner(winnerAddress, bid, this.pubKey);
        });

        this.auctionContract.contract.on("NotEnoughMoney", (bidderAddress, bidSent, actualPrice) => {
            if (bidderAddress.toLowerCase() == this.pubKey)
                bidderUI.notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice);
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

    // bidding a value to the Auction
    async bid(bidValue) {
        let overrides = {
            gasLimit: 900000, // value based on the gas estimation done in the final-term
            value: ethers.utils.parseEther(bidValue)
        };

        await this.auctionContract.contract.bid(overrides);

    }

}

// called when the window loads
$(window).on('load', function () {
    bidder = new Bidder();
});
