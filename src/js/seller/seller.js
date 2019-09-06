//const sellerPrivateKey = "1009aede31276e121c6ad07f83bf5a7f9b9e6a009dbd59ea30630515e3b7fa87";

let seller = null;
class Seller extends User{
    constructor(){
        super();
    }

    async subscribeToAuctionHouse(auctionHouseAddress){
        let c = await $.getJSON("AuctionHouse.json");
           
        this.auctionHouseContract = new ethers.Contract(auctionHouseAddress, c.abi, App.provider.getSigner());
        
        console.log("connected to auction house");

        this.registerToAuctionHouseEvents();

        this.auctionHouseContract.subscribeAsSeller();
   
    }


    registerToAuctionHouseEvents(){

        this.auctionHouseContract.on("NewSellerSubscribed",(sellerAddress) =>{
            if(sellerAddress.toLowerCase() == ethereum.selectedAddress.toLowerCase())    
                sellerUI.successfullySubscribed();
        });

        this.auctionHouseContract.on("AuctionSubmitted",(sellerAddress, objectDescription) =>{
            if (sellerAddress.toLowerCase() == ethereum.selectedAddress.toLowerCase())
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

    submitAuction(objectDescription){
        this.auctionHouseContract.submitAuction(objectDescription);
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
            sellerUI.notifyWinner(winnerAddress,bid);
        });

        this.auctionContract.contract.on("NewBlock",(blockNumber)=>{
            sellerUI.newBlock(blockNumber);
        });


        this.auctionContract.contract.on("EscrowAccepted",(address)=>{
            if (address.toLowerCase() == ethereum.selectedAddress.toLowerCase())
                sellerUI.escrowAccepted();
        });

        this.auctionContract.contract.on("EscrowRefused",(address)=>{
            if (address.toLowerCase() == ethereum.selectedAddress.toLowerCase())
                sellerUI.escrowRefused();
        });

        this.auctionContract.contract.on("EscrowClosed",()=>{
                sellerUI.escrowClosed();
        });
    }

}



// Call init whenever the window loads

$(window).on('load', function () {
       seller = new Seller();
});






