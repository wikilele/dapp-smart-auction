// variable storing the sller (user) informations
let seller = null;

class Seller extends User{
    constructor(){
        super();
    }

    // connecting to the AuctionHouse 
    async subscribeToAuctionHouse(auctionHouseAddress){
        this.auctionHouseContract = new AuctionHouse();
        await this.auctionHouseContract.connect(App.provider.getSigner(),auctionHouseAddress );

        this.auctionHouseContract.registerToEvents(sellerUI);
        
        try{
            await this.auctionHouseContract.subscribeAsSeller();
        }catch(err){
            // already subscribed
            notifyTransactionError("transaction reverted");
        }
    }


    notifyNewAuction(auctionAddress, auctionType, objectDesciption){
        this.auctionContract = new DutchAuction();  // depends on auction type
        this.auctionContract.objectDescription = objectDesciption;
        this.auctionContract.contractAddress = auctionAddress;
        this.connectToContract();
    }

    // submitting a new auction giving a description of the selled object
    submitAuction(objectDescription){
        this.auctionHouseContract.submitAuction(objectDescription);
    }

    // connecting to the deployed contract
    async connectToContract(){

        await this.auctionContract.connect( App.provider.getSigner(), this.auctionContract.contractAddress);
        this.auctionContract.registerToEvents(sellerUI);
    }

}

// called when the window loads
$(window).on('load', function () {
       seller = new Seller();
});






