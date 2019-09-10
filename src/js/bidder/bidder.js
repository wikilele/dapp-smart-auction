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

        this.auctionHouseContract.on("NewAuction", (auctionAddress, auctionType, objectDesciption) => {
            this.auctionContract = new DutchAuction();
            this.auctionContract.objectDesciption = objectDesciption;
            this.auctionContract.contractAddress = auctionAddress;

            bidderUI.notifyNewAuction(auctionAddress, auctionType, objectDesciption);
        });
    }

    // connecting to the deployed contract
    async connectToContract() {
        let c = await $.getJSON("DutchAuction.json")
        this.auctionContract.contract = new ethers.Contract(this.auctionContract.contractAddress, c.abi, App.provider.getSigner());
        console.log("connected");

        // this is specific to DutchAuction
        this.auctionContract.contract.on("NotEnoughMoney", (bidderAddress, bidSent, actualPrice) => {
            if (bidderAddress.toLowerCase() == this.pubKey)
                bidderUI.notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice);
        });

        return this.registerToAuctionEvents();
    }

    // subscribing to the Auction's events
    registerToAuctionEvents() {
        this.auctionContract.contract.on("Winner", (winnerAddress, bid) => {
            bidderUI.notifyWinner(winnerAddress, bid, this.pubKey);
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

    // bidding a value to the Auction
    async bid(bidValue) {
        await this.auctionContract.bid(bidValue);
    }

}

// called when the window loads
$(window).on('load', function () {
    bidder = new Bidder();
});
