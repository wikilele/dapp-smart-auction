$("#metamaskAccountUsedBtn").click(function () {
  // showing the card to deploy the auction house and that one with the sellers and bidders lists
  $("#auctionHouseCard").show();
  $("#sellersAndBiddersListCard").show();

  showSpinnerNextTo("#auctionHouseContractAddressDeployBtn");
  // checking if there is already an auction deployed
  $.ajax({
    type: "GET",
    url: "auctionhouse/address",
    dataType: 'json',
    success: function (data) {

      if (data.contractAddress != "") {
        // an AuctionHouse already exists
        auctioneerUI.setAuctionHouseAddress(data.contractAddress);
        auctioneer.connectToAuctionHouse(data.contractAddress);

        // getting the subscribed sellers
        $.ajax({
          type: "GET",
          url: "auctionhouse/subscribedsellers",
          dataType: 'json',
          success: function (data) {
            data.sellers.forEach(function (elem) {
              $("#subscribedSellersList").append("<li class='list-group-item'>" + elem + "</li>");
            })
          }
        })
        // getting the subscribed bidders
        $.ajax({
          type: "GET",
          url: "auctionhouse/subscribedbidders",
          dataType: 'json',
          success: function (data) {
            data.bidders.forEach(function (elem) {
              $("#subscribedBiddersList").append("<li class='list-group-item'>" + elem + "</li>");
            })
          }
        })
      } else {
        // the AuctionHouse needs to be deployed
        hideSpinnerNextTo("#auctionHouseContractAddressDeployBtn");
        $("#auctionHouseContractAddressDeployBtn").show();
      }

    }
  });
});

$("#auctionHouseContractAddressDeployBtn").click(async function () {
  // deploying the AuctionHouse contract
  $("#auctionHouseContractAddressDeployBtn").hide();
  showSpinnerNextTo("#auctionHouseContractAddressDeployBtn");
  $("#auctionHouseContractAddress").text("");

  auctioneer.init();
})

$("#auctionType").change(function () {
  let type = $("#auctionType option:selected").text();

  changeViewBasedOn(type);
})


$("#deployContract").click(async function () {
  // deploying the Auction contract
  showSpinnerNextTo("#deployContract");
  $("#deployContract").hide();
  $("#newAuctionSubmitted").hide();

  let auctionType = $("#auctionType option:selected").text();
  let objectDescription = $("#currentAuctionObjectDescription").text();

  if (auctionType == "DutchAuction") {
    // deploying DutchAuction
    let strategy = $("#decreasingStrategy option:selected").text();
    let _reservePrice = $("#_reservePrice").val();
    let _initialPrice = $("#_initialPrice").val();
    let _openedForLength = $("#_openedForLength").val();
    let _seller = $("#_sellerAddress").val();
    let miningRate = $("#miningRate").val();

    try {
      await auctioneer.initDutchAuction(strategy, _reservePrice, _initialPrice, _openedForLength, _seller, miningRate, objectDescription);
    } catch (err) {
      console.log(err);
      // "reverting the UI" if something went wrong, and notify the user
      notifyTransactionError("transaction reverted");
      $("#deployContract").show();
      hideSpinnerNextTo("#deployContract");
    }

  } else if (auctionType == "VickreyAuction") { // deploying VickreyAuction
    let _reservePrice = $("#_reservePrice").val();
    let _depositRequired = $("#_depositRequired").val();
    let _commitmentPhaseLength = $("#_commitmentPhaseLength").val();
    let _withdrawalPhaseLength = $("#_withdrawalPhaseLength").val();
    let _openingPhaseLength = $("#_openingPhaseLength").val();
    let _seller = $("#_sellerAddress").val();
    let miningRate = $("#miningRate").val();

    try {
      await auctioneer.initVickreyAuction(_reservePrice, _commitmentPhaseLength, _withdrawalPhaseLength, _openingPhaseLength, _depositRequired, _seller, miningRate, objectDescription);
    } catch (err) {
      console.log(err);
      // "reverting the UI" if something went wrong, and notify the user
      notifyTransactionError("transaction reverted");
      $("#deployContract").show();
      hideSpinnerNextTo("#deployContract");
    }
  } else {
    throw "auction type " + auctionType;
  }


});

$("#finalize").click(async function () {
  try {
    await auctioneer.finalize();
  } catch (err) {
    notifyTransactionError("transaction reverted");
  }
})

$("#destroyContract").click(async function () {
  await auctioneer.destroyContracts();
})




