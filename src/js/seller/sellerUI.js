$("#metamaskAccountUsedBtn").click(function () {
  // showing the card to subscribe to the AuctionHouse
  $("#subscribeToAuctionHouseCard").show();
});

$("#subscribeToAuctionHouse").click(function () {
  // subscribing to the AuctionHouse
  $("#subscribeToAuctionHouse").hide();
  showSpinnerNextTo("#subscribeToAuctionHouse");

  let address = $("#auctionHouseAddress").val();
  seller.subscribeToAuctionHouse(address);
});


$("#submitAuction").click(function () {
  // submitting a new auction
  $("#submitAuction").hide();
  showSpinnerNextTo("#submitAuction");

  let objectDescription = $("#objectDescription").val();
  seller.submitAuction(objectDescription);
});


sellerUI = {
  // notify a successfull subscription to the AuctionHouse
  successfullySubscribed: function () {
    hideSpinnerNextTo("#subscribeToAuctionHouse");
    $("#subscribeToAuctionHouseSuccess").show();
    $("#submitCard").show();
  },

  // notify that the auction was successfully submitted
  auctionSuccessfullySubmitted: function () {
    hideSpinnerNextTo("#submitAuction");
    $("#submitAuctionSuccess").show();
  },

  // showing the list of functions to interact with the contract
  newAuction: function () {
    $("#contractFunctionsCard").show();
  },

  // showing the winner address
  notifyWinner: function (winnerAddress, bid) {
    console.log(winnerAddress + " won bidding " + bid);

    $("#notificationModalInfo").text(winnerAddress + " won bidding " + bid);
    $("#notificationModal").modal("toggle");
  }

}
