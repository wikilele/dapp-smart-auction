$("#subscribeToAuctionHouse").click(function(){
    
  let address = $("#auctionHouseAddress").val();
  bidder.subscribeToAuctionHouse(address);

  $("#subscribeToAuctionHouse").hide();
  $("#subscribeToAuctionHouseSuccess").show();

});



$("#bidButton").click(function(){
    let bidValue = $("#bidValue").val();
    bidder.bid(bidValue);
  });


$("#joinAuctionModal").click(function(){
    bidder.connectToContract();
    $("#auctionCreatedModal").modal("hide");
})

  



/*
$("#acceptEscrow").click(function(){
  Bidder.acceptEscrow();
});

$("#getCurrentPrice").click(function(){
  Bidder.getCurrentPrice();
});



$("#acceptEscrow").click(function(){
  App.acceptEscrow(Bidder.dutchAuctionContract);
});
*/