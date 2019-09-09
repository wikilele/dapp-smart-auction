// variable storing the sller (user) informations
let seller = null;

class Seller extends User{
    constructor(){
        super();
    }

    // connecting to the AuctionHouse 
    async subscribeToAuctionHouse(auctionHouseAddress){
        let c = await $.getJSON("AuctionHouse.json");
           
        this.auctionHouseContract = new ethers.Contract(auctionHouseAddress, c.abi, App.provider.getSigner());
        
        console.log("connected to auction house");

        this.registerToAuctionHouseEvents();

        try{
            await this.auctionHouseContract.subscribeAsSeller();
        }catch(err){
            // already subscribed
            appUI.notifyTransactionError("transaction reverted");
        }
    }

    // subscribing to the AuctionHouse's events
    registerToAuctionHouseEvents(){

        this.auctionHouseContract.on("NewSellerSubscribed",(sellerAddress) =>{
            if(sellerAddress.toLowerCase() == this.pubKey)    
                sellerUI.successfullySubscribed();
        });

        this.auctionHouseContract.on("AuctionSubmitted",(sellerAddress, objectDescription) =>{
            if (sellerAddress.toLowerCase() == this.pubKey)
            sellerUI.auctionSuccessfullySubmitted();         
        });

        this.auctionHouseContract.on("NewAuction",(auctionAddress, auctionName, objectDesciption) =>{          
            // ASSUME the new auction is the one just submitted
            this.auctionContract = new DutchAuction();
            this.auctionContract.objectDescription = objectDesciption;
            this.auctionContract.contractAddress = auctionAddress;
            this.connectToContract();
            sellerUI.newAuction(auctionAddress, auctionName, objectDesciption);
            
        });

    }

    // submitting a new auction giving a description of the selled object
    submitAuction(objectDescription){
        this.auctionHouseContract.submitAuction(objectDescription);
    }

    // connecting to the deployed contract
    async connectToContract(){
      
        let c  = await $.getJSON("DutchAuction.json")
        this.auctionContract.contract = new ethers.Contract(this.auctionContract.contractAddress, c.abi, App.provider.getSigner());
        console.log("connected");
  
        return this.registerToAuctionEvents();
    }

     // subscribing to the Auction's events
    registerToAuctionEvents(){
        this.auctionContract.contract.on("Winner",(winnerAddress, bid)=>{
            sellerUI.notifyWinner(winnerAddress,bid);
        });

        this.auctionContract.contract.on("NewBlock",(blockNumber)=>{
            appUI.newBlock(blockNumber);
        });

        this.auctionContract.contract.on("EscrowAccepted",(address)=>{
            if (address.toLowerCase() == this.pubKey)
                appUI.escrowAccepted();
        });

        this.auctionContract.contract.on("EscrowRefused",(address)=>{
            if (address.toLowerCase() == this.pubKey)
                appUI.escrowRefused();
        });

        this.auctionContract.contract.on("EscrowClosed",()=>{
                appUI.escrowClosed();
        });
    }

}

// called when the window loads
$(window).on('load', function () {
       seller = new Seller();
});






