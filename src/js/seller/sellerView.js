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
  seller.subscribeToAuctionHouse(address);
});


$("#submitAuction").click(function () {
  // submitting a new auction
  $("#submitAuction").hide();
  showSpinnerNextTo("#submitAuction");

  let objectDescription = $("#objectDescription").val();
  seller.submitAuction(objectDescription);
});


