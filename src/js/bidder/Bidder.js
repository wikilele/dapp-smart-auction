// variable storing the bidder (user) informations
var bidder = null;

class Bidder extends User {
    constructor() {
        super();

    }

    // connecting to the AuctionHouse 
    async subscribeToAuctionHouse(auctionHouseAddress) {
        this.auctionHouseContract = new AuctionHouse();
        await this.auctionHouseContract.connect(App.provider.getSigner(),auctionHouseAddress );

        this.auctionHouseContract.registerToEvents(bidderUI);
        
        try{
            await this.auctionHouseContract.subscribeAsBidder();
        }catch(err){
            // already subscribed
            notifyTransactionError("Probably that address is already subscribed");
            bidderUI.newBidderSubscribed(this.pubKey);
        }
    }

    notifyNewAuction(auctionAddress, auctionType, objectDesciption){
        if(auctionType == "VickreyAuction"){
            this.auctionContract = new VickreyAuction();
        } else {
            this.auctionContract = new DutchAuction();  
        }
        this.auctionContract.objectDescription = objectDesciption;
        this.auctionContract.contractAddress = auctionAddress;
    }

    // connecting to the deployed contract
    async connectToContract() {
        await this.auctionContract.connect( App.provider.getSigner(), this.auctionContract.contractAddress);
        this.auctionContract.registerToEvents(bidderUI);
    }

    // bidding a value to the Auction
    async bid(bidValue) {
        await this.auctionContract.bid(bidValue);
    }
    async commitBid(bidValue, nonce, deposit){
        await this.auctionContract.commitBid(bidValue,nonce,deposit);
    }

    async withdraw(){
        await this.auctionContract.withdraw();
    }

    async open(nonce, bid){
        await this.auctionContract.open(nonce,bid);
    }

}

// called when the window loads
$(window).on('load', function () {
    bidder = new Bidder();
});
