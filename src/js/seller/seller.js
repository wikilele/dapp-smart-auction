const sellerPrivateKey = "1009aede31276e121c6ad07f83bf5a7f9b9e6a009dbd59ea30630515e3b7fa87";

Seller = {
    auctionHouseContract: null,
    dutchAuctionContract : null,
    wallet: null,

    initWallet : function(){ 
        Seller.wallet = new ethers.Wallet( sellerPrivateKey, App.provider);
    },


    subscribeToAuctionHouse: function (auctionHouseAddress){
        $.getJSON("AuctionHouse.json").then((c)=>{
           
            Seller.auctionHouseContract = new ethers.Contract(auctionHouseAddress, c.abi, Seller.wallet);
            console.log("connected to auction house");

            Seller.auctionHouseContract.subscribeAsSeller();
            //Seller.registerToEvents();
         });
    },

    submitAuction: function(objectDescription){
        Seller.auctionHouseContract.submitAuction(objectDescription);
    },


    connectToContract: function(contractAddress){
         // Load the wallet to connect the contract with
         $.getJSON("DutchAuction.json").then((c)=>{
            Seller.dutchAuctionContract = new ethers.Contract(contractAddress, c.abi, Seller.wallet);
            console.log("connected");

            Seller.registerToEvents();
         });
         
    },

    registerToEvents: function(){
        Seller.dutchAuctionContract.on("Winner",(winnerAddress, bidValue) => {
            console.log("Someone has won, address " + winnerAddress + " bid value " + bidValue);
        });

    },


    acceptEscrow: function(){
        Seller.dutchAuctionContract.acceptEscrow();
    },

    refuseEscrow: function(){
        Seller.dutchAuctionContract.refuseEscrow();
    }

}





// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        Seller.initWallet();
    });
});