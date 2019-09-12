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
  $("#biddingSpinner").show();

  $("#bidButton").hide();
  let bidValue = $("#bidValue").val();
  if (bidder.auctionContract.type == "DutchAuction") {
    try {
      await bidder.bid(bidValue);
    } catch (err) {
      // "reverting the UI" if something went wrong, alerting the user
      notifyTransactionError("transaction reverted");
      $("#bidButton").show();
      $("#biddingSpinner").hide();
    }
  } else{
    let nonce = $("#nonceChoosen").val();
    let deposit = $("#depositRequired").val();
    try {
      await bidder.bid(bidValue,nonce,deposit);
    } catch (err) {
      // "reverting the UI" if something went wrong, alerting the user
      notifyTransactionError("transaction reverted");
      $("#bidButton").show();
      $("#biddingSpinner").hide();
    }
  }

});


$("#withdrawButton").click(async function () {
  // withdrawing
  $("#biddingSpinner").show();

  $("#withdrawButton").hide();

  try {
    await bidder.withdraw();
  } catch (err) {
    // "reverting the UI" if something went wrong, alerting the user
    notifyTransactionError("transaction reverted");
    $("#withdrawButton").show();

    $("#biddingSpinner").hide();
  }
});


$("#openButton").click(async function () {
  // withdrawing
  $("#biddingSpinner").show();

  $("#openButton").hide();
  let bidValue = $("#bidValue").val();
  let nonce = $("#nonceChoosen").val();
  try {
    await bidder.open(nonce, bidValue);
  } catch (err) {
    console.log(err);
    // "reverting the UI" if something went wrong, alerting the user
    notifyTransactionError("transaction reverted");
    $("#openButton").show();

    $("#biddingSpinner").hide();
  }
});


$("#joinAuctionModal").click(function () {
  // joining the created Auction
  bidder.connectToContract();
  $("#auctionCreatedModal").modal("hide");
  $("#currentAuctionCard").show();

  $("#withdrawButton").hide();
  $("#openButton").hide();

  $("#joinedNewAuctionSuccess").show();

  $("#contractFunctionsCard").show();
})


