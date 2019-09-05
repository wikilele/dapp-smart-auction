$("#subscribeToAuctionHouse").click(function(){
  $("#subscribeToAuctionHouse").hide();
  
  let address = $("#auctionHouseAddress").val();
  bidder.subscribeToAuctionHouse(address);


});


$("#bidButton").click(function(){
    let bidValue = $("#bidValue").val();
    bidder.bid(bidValue);
  });


$("#joinAuctionModal").click(function(){
    bidder.connectToContract();
    $("#auctionCreatedModal").modal("hide");
    $("#bidButton").show();
    $("#joinedNewAuctionSuccess").show();
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
    console.log(winnerAddress + " won bidding " + bid );
  },

  notifyNotEnoughMoney: function(bidderAddress, bidSent, actualPrice){
    console.log("You bidded " + bidSent + " but the actual price was " + actualPrice );
  },

  newBlock: function(blockNumber){
    console.log("Block added " + blockNumber);
  }
}


$(function() {
  $(window).on('load', function () {
    $("#bidButton").hide();

  });
});
