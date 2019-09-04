const  bidderPrivateKey =  "12afbd86f1dfff78fbc01916eb5f2a8578be198d1dcec533a518a10510b9efd9";


Bidder = {
    objectDescription: null,
    dutchAuctionContractAddress : null,
    dutchAuctionContract : null,
    wallet: null,

    initWallet : function(){ 
        Bidder.wallet = new ethers.Wallet( bidderPrivateKey, App.provider);
    },


    subscribeToAuctionHouse: function (auctionHouseAddress){
        $.getJSON("AuctionHouse.json").then((c)=>{
           
            Bidder.auctionHouseContract = new ethers.Contract(auctionHouseAddress, c.abi, Bidder.wallet);
            console.log("connected to auction house");

            Bidder.auctionHouseContract.subscribeAsBidder();
            
            Bidder.auctionHouseContract.on("NewAuction", (auctionAddress, auctionName, objectDesciption) =>{
                Bidder.objectDesciption = objectDesciption;
                Bidder.dutchAuctionContractAddress = auctionAddress;
                $("#contractAddressModal").text(auctionAddress);
                $("#auctionTypeModal").text(auctionName);
                $("#objectDescriptionModal").text(objectDesciption);
                $("#auctionCreatedModal").modal("toggle");
            });
         });
    },


    connectToContract: function(){
         // Load the wallet to connect the contract with
       
         $.getJSON("DutchAuction.json").then((c)=>{
            Bidder.dutchAuctionContract = new ethers.Contract(Bidder.dutchAuctionContractAddress, c.abi, Bidder.wallet);
            console.log("connected");

            

            Bidder.registerToEvents();
         });
         
    },

    registerToEvents: function(){
        Bidder.dutchAuctionContract.on("Winner",(winnerAddress, bidValue) => {
            console.log("Someone has won, address " + winnerAddress + " bid value " + bidValue);
        });

        Bidder.dutchAuctionContract.on("NotEnoughMoney",(bidderAddress, moneySent, actualPrice) => {
            console.log("You sent " + moneySent + " but the actual price was " + actualPrice);
        });
    },


    getCurrentPrice: function(){
        Bidder.dutchAuctionContract.getCurrentPrice().then((price) => {
            console.log(price.toNumber());
        });
    },

    bid: function(bidValue){
        let overrides = {
            gasLimit: 925993,
            value : ethers.utils.parseEther(bidValue)
        };
        Bidder.dutchAuctionContract.bid(overrides);
    },

    acceptEscrow: function(){
        Bidder.dutchAuctionContract.acceptEscrow();
    },

    refuseEscrow: function(){
        Bidder.dutchAuctionContract.refuseEscrow();
    }

}





// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        Bidder.initWallet();
    });
});