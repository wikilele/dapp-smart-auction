$("#subscribeToAuctionHouse").click(function(){
  $("#subscribeToAuctionHouse").hide();
  $("#subscribeToAuctionHouse").next().show();

  
  let address = $("#auctionHouseAddress").val();
  bidder.subscribeToAuctionHouse(address);


});


$("#bidButton").click(function(){
    $("#bidButton").next().show(); // showing spinner
    $("#bidButton").hide();
    let bidValue = $("#bidValue").val();
    bidder.bid(bidValue);
  });


$("#joinAuctionModal").click(function(){
    bidder.connectToContract();
    $("#auctionCreatedModal").modal("hide");
    $("#currentAuctionCard").show();
    $("#joinedNewAuctionSuccess").show();

    $("#contractFunctionsCard").show();
})

bidderUI = {
  successfullySubscribed: function(){
    $("#subscribeToAuctionHouse").next().hide();
    $("#subscribeToAuctionHouseSuccess").show();
  },

  notifyNewAuction: function(auctionAddress, auctionName, objectDesciption){
    $("#contractAddressModal").text(auctionAddress);
    $("#auctionTypeModal").text(auctionName);
    $("#objectDescriptionModal").text(objectDesciption);
    $("#auctionCreatedModal").modal("toggle");
  },

  notifyWinner: function(winnerAddress, bid, yourAddress){
    $("#bidButton").next().hide();
    console.log(winnerAddress + " won bidding " + bid );
    if(winnerAddress == yourAddress)
      winnerAddress = "You";

    $("#notificationModalInfo").text(winnerAddress + " won bidding " + bid);
    $("#notificationModal").modal("toggle");
  },

  notifyNotEnoughMoney: function(bidderAddress, bidSent, actualPrice){
    $("#bidButton").next().hide(); // hiding spinner
    $("#bidButton").show();
    console.log("You bidded " + bidSent + " but the actual price was " + actualPrice );
    $("#notificationModalInfo").text("You bidded " + bidSent + " but the actual price was " + actualPrice);

    $("#notificationModal").modal("toggle");
  },

  newBlock: function(blockNumber){
    console.log("Block added " + blockNumber);
    $("#addBlockResult").text(blockNumber);
  },
  
  escrowAccepted: function(){
    console.log("Escrow Accepted!");
    $("#acceptEscrowResultSuccess").show();
  },
  escrowRefused: function(){
    console.log("Escrow Refused!");
    $("#refuseEscrowResultSuccess").show();
  },

  escrowClosed: function(){
    console.log("Escrow Closed!");
    $("#concludeEscrowResultSuccess").show();

    $("#notificationModalInfo").text("Escrow Closed successfully");

    $("#notificationModal").modal("toggle");
  }
}


