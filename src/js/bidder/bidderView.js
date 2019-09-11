$("#metamaskAccountUsedBtn").click(function () {
  // showing the card to subscribe to the AuctionHouse
  $("#subscribeToAuctionHouseCard").show();
  showSpinnerNextTo("#subscribeToAuctionHouse");

  setTimeout(checkForAuctionHouseAddress, 1000);
});

$("#subscribeToAuctionHouse").click(function () {
  // subscribing to the AuctionHouse
  $("#subscribeToAuctionHouse").hide();
  showSpinnerNextTo("#subscribeToAuctionHouse");

  let address = $("#auctionHouseAddress").text();
  bidder.subscribeToAuctionHouse(address);

});


$("#bidButton").click(async function () {
  // bidding
  showSpinnerNextTo("#bidButton");

  $("#bidButton").hide();
  let bidValue = $("#bidValue").val();
  try {
    await bidder.bid(bidValue);
  } catch (err) {
    // "reverting the UI" if something went wrong, alerting the user
    notifyTransactionError("transaction reverted");
    $("#bidButton").show();
    hideSpinnerNextTo("#bidButton");
  }
});


$("#joinAuctionModal").click(function () {
  // joining the created Auction
  bidder.connectToContract();
  $("#auctionCreatedModal").modal("hide");
  $("#currentAuctionCard").show();
  $("#joinedNewAuctionSuccess").show();

  $("#contractFunctionsCard").show();
})


