$("#subscribeToAuctionHouse").click(function(){
    
  let address = $("#auctionHouseAddress").val();
  Bidder.subscribeToAuctionHouse(address);

  $("#subscribeToAuctionHouse").hide();
  $("#subscribeToAuctionHouseSuccess").show();

});



$("#bidButton").click(function(){
    let bidValue = $("#bidValue").val();
    Bidder.bid(bidValue);
  });
  
  
  $("#connect").click(function(){
    let address = $("#contractAddress").val();
    Bidder.connectToContract(address);
  });


$("#acceptEscrow").click(function(){
  Bidder.acceptEscrow();
});

$("#getCurrentPrice").click(function(){
  Bidder.getCurrentPrice();
});

$("#joinAuctionModal").click(function(){
  Bidder.connectToContract();
  $("#auctionCreatedModal").modal("hide");
})


$("#acceptEscrow").click(function(){
  App.acceptEscrow(Bidder.dutchAuctionContract);
});
