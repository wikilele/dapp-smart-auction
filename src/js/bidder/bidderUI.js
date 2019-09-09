$("#metamaskAccountUsedBtn").click(function () {
  // showing the card to subscribe to the AuctionHouse
  $("#subscribeToAuctionHouseCard").show();
});

$("#subscribeToAuctionHouse").click(function () {
  // subscribing to the AuctionHouse
  $("#subscribeToAuctionHouse").hide();
  $("#subscribeToAuctionHouse").next().show();

  let address = $("#auctionHouseAddress").val();
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
    appUI.notifyTransactionError("transaction reverted");
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

bidderUI = {
  // notify the user of a successful subscription to the AuctionHouse contract
  successfullySubscribed: function () {
    hideSpinnerNextTo("#subscribeToAuctionHouse");
    $("#subscribeToAuctionHouseSuccess").show();
  },

  // showing the modal to join the new auction
  notifyNewAuction: function (auctionAddress, auctionName, objectDesciption) {
    $("#contractAddressModal").text(auctionAddress);
    $("#auctionTypeModal").text(auctionName);
    $("#objectDescriptionModal").text(objectDesciption);
    $("#auctionCreatedModal").modal("toggle");
  },

  // showing the winner
  notifyWinner: function (winnerAddress, bid, yourAddress) {
    hideSpinnerNextTo("#bidButton");
    console.log(winnerAddress + " won bidding " + bid);

    $("#notificationModalInfo").text(winnerAddress + " won bidding " + bid);
    $("#notificationModal").modal("toggle");

  },

  // telling the user that his bid wasn't enough
  notifyNotEnoughMoney: function (bidderAddress, bidSent, actualPrice) {
    hideSpinnerNextTo("#bidButton");
    $("#bidButton").show();
    console.log("You bidded " + bidSent + " but the actual price was " + actualPrice);
    $("#notificationModalInfo").text("You bidded " + bidSent + " but the actual price was " + actualPrice);

    $("#notificationModal").modal("toggle");
  }
}

