const sellerPrivateKey = "1009aede31276e121c6ad07f83bf5a7f9b9e6a009dbd59ea30630515e3b7fa87";

let seller = null;
class Seller extends User{
    constructor(privateKey){
        super(privateKey);
    }

    async subscribeToAuctionHouse(auctionHouseAddress){
        let c = await $.getJSON("AuctionHouse.json");
           
        this.auctionHouseContract = new ethers.Contract(auctionHouseAddress, c.abi, this.wallet);
        
        console.log("connected to auction house");

        this.auctionHouseContract.subscribeAsSeller();
        
        return this.registerToAuctionHouseEvents();
   
    }


    registerToAuctionHouseEvents(){

        this.auctionHouseContract.on("NewSellerSubscribed",(bidderAddress) =>{
            if(bidderAddress == this.wallet.address)    
                console.log("You successfully subscribed!");
        });

        this.auctionHouseContract.on("AuctionSubmitted",(sellerAddress, objectDescription) =>{
            if (sellerAddress == this.wallet.address)
                console.log("auction successfully submitted");          
        });
    }

    submitAuction(objectDescription){
        this.auctionHouseContract.submitAuction(objectDescription);
    }

    async connectToContract(){
        // Load the wallet to connect the contract with
      
        let c  = await $.getJSON("DutchAuction.json")
        this.auctionContract.contract = new ethers.Contract(this.auctionContract.contractAddress, c.abi, this.wallet);
        console.log("connected");
  
        return this.registerToAuctionEvents();
    }


    registerToAuctionEvents(){
        this.auctionContract.contract.on("Winner",(winnerAddress, bid)=>{
            console.log(winnerAddress + " won bidding " + bid );
        });

        this.auctionContract.contract.on("NewBlock",(blockNumber)=>{
            console.log("Block added " + blockNumber);
        });
    }

}



// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        seller = new Seller(sellerPrivateKey);
    });
});





