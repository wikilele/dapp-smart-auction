//const  bidderPrivateKey =  "12afbd86f1dfff78fbc01916eb5f2a8578be198d1dcec533a518a10510b9efd9";

let bidder = null;

class Bidder extends User{
    constructor(){
        super();

    }

    async subscribeToAuctionHouse(auctionHouseAddress){
        let c = await $.getJSON("AuctionHouse.json");
           
        this.auctionHouseContract = new ethers.Contract(auctionHouseAddress, c.abi, App.provider.getSigner());
        
        console.log("connected to auction house");

        
        this.registerToAuctionHouseEvents();

        this.auctionHouseContract.subscribeAsBidder();
   
    }


    registerToAuctionHouseEvents(){

        this.auctionHouseContract.on("NewBidderSubscribed",(bidderAddress) =>{
            if(bidderAddress.toLowerCase() == this.pubKey)    
                bidderUI.successfullySubscribed();
        });

        this.auctionHouseContract.on("NewAuction",(auctionAddress, auctionName, objectDesciption) =>{
            this.auctionContract = new DutchAuction();
            this.auctionContract.objectDesciption = objectDesciption;
            this.auctionContract.contractAddress = auctionAddress;

            bidderUI.notifyNewAuction(auctionAddress, auctionName, objectDesciption);
            
        });
    }

    async connectToContract(){
        // Load the wallet to connect the contract with
      
        let c  = await $.getJSON("DutchAuction.json")
        this.auctionContract.contract = new ethers.Contract(this.auctionContract.contractAddress, c.abi, App.provider.getSigner());
        console.log("connected");
  
        return this.registerToAuctionEvents();
    }


    registerToAuctionEvents(){
        this.auctionContract.contract.on("Winner",(winnerAddress, bid)=>{
            bidderUI.notifyWinner(winnerAddress, bid, this.pubKey);
        });

        this.auctionContract.contract.on("NotEnoughMoney",(bidderAddress, bidSent, actualPrice)=>{
            if(bidderAddress.toLowerCase() == this.pubKey)
                bidderUI.notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice);
        });

        this.auctionContract.contract.on("NewBlock",(blockNumber)=>{

            bidderUI.newBlock(blockNumber);
        });

        this.auctionContract.contract.on("EscrowAccepted",(address)=>{
            if (address.toLowerCase() == this.pubKey)
                bidderUI.escrowAccepted();
        });

        this.auctionContract.contract.on("EscrowRefused",(address)=>{
            if (address.toLowerCase() == this.pubKey)
                bidderUI.escrowRefused();
        });

        this.auctionContract.contract.on("EscrowClosed",()=>{
                bidderUI.escrowClosed();
        });
    }

    bid(bidValue){
        let overrides = {
            gasLimit: 925993, // todo check better
            value : ethers.utils.parseEther(bidValue)
        };

        this.auctionContract.contract.bid(overrides);
       
    }

}

// Call init whenever the window loads

$(window).on('load', function () {
    bidder = new Bidder();
});
