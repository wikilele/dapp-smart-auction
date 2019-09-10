// copying the element to clipboard
function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

$("#metamaskAccountUsedBtn").click(function () {
  // showing the card to deploy the auction house and that one with the sellers and bidders lists
  $("#auctionHouseCard").show();
  $("#sellersAndBiddersListCard").show();
});

$("#auctionHouseContractAddressDeployBtn").click(async function () {
  // deploying the AuctionHouse contract
  $("#auctionHouseContractAddressDeployBtn").hide();
  showSpinnerNextTo("#auctionHouseContractAddressDeployBtn");
  $("#auctionHouseContractAddress").text("");

  auctionhouse.init();
})

$("#auctionType").change(function () {
  let type = $("#auctionType option:selected").text();
  if (type == "Dutch") {
    $(".dutch").show();
    $(".vickrey").hide();
  } else {
    $(".vickrey").show();
    $(".dutch").hide();
  }
})


$("#deployContract").click(async function () {
  // deploying the Auction contract
  showSpinnerNextTo("#deployContract");
  $("#deployContract").hide();
  $("#newAuctionSubmitted").hide();

  let auctionType = $("#auctionType option:selected").text();

  if (auctionType == "Dutch") {
    // deploying DutchAuction
    let strategy = $("#decreasingStrategy option:selected").text();
    let _reservePrice = $("#_reservePrice").val();
    let _initialPrice = $("#_initialPrice").val();
    let _openedForLength = $("#_openedForLength").val();
    let _seller = $("#_sellerAddress").val();
    let miningRate = $("#miningRate").val();

    try {
      await auctionhouse.initDutchAuction(strategy, _reservePrice, _initialPrice, _openedForLength, _seller, miningRate);
    } catch (err) {
      console.log(err);
      // "reverting the UI" if something went wrong, and notify the user
      appUI.notifyTransactionError("transaction reverted");
      $("#deployContract").show();
      hideSpinnerNextTo("#deployContract");
    }

  } else { // deploying VickreyAuction
    let _reservePrice = $("#_reservePrice").val();
    let _depositReuired = $("#_depositRequired").val();
    let _commitmentPhaseLength = $("#_commitmentPhaseLength").val();
    let _withdrawalPhaseLength = $("#_withdrawalPhaseLength").val();
    let _openingPhaseLength = $("#_openingPhaseLength").val();
    let _seller = $("#_sellerAddress").val();
    let miningRate = $("#miningRate").val();

    try {
      await auctionhouse.initVickreyAuction(_reservePrice, _commitmentPhaseLength,_withdrawalPhaseLength,_openingPhaseLength, _depositReuired, _seller, miningRate);
    } catch (err) {
      console.log(err);
      // "reverting the UI" if something went wrong, and notify the user
      appUI.notifyTransactionError("transaction reverted");
      $("#deployContract").show();
      hideSpinnerNextTo("#deployContract");
    }
  }

});

$("#auctionHouseContractAddressCopyBtn").click(function () {
  // copy the AuctionHouse contract's address to clipboard
  copyToClipboard("#auctionHouseContractAddress");
});

$("#destroyContract").click(async function () {
  await auctionhouse.destroyContracts();
})

auctionhouseUI = {
  // displaying the AuctionHouse contract's address
  setAuctionHouseAddress: function (address) {
    hideSpinnerNextTo("#auctionHouseContractAddressDeployBtn");
    $("#auctionHouseContractAddressCopyBtn").show();
    $("#auctionHouseContractAddress").text(address);
  },

  // displaying the card to deploy a new auction
  newAuctionSubmitted: function (sellerAddress, objectDescription) {
    $("#auctionCard").show();
    $("#newAuctionSubmitted").show();

    $("#currentAuctionHeader").text("A new Auction has been submitted!");
    $("#currentAuctionObjectDescription").text(objectDescription);
    $("#_sellerAddress").val(sellerAddress);
  },

  // adding an address to the sellers' list
  newSellerSubscribed: function (sellerAddress) {
    $("#subscribedSellersList").append("<li class='list-group-item'>" + sellerAddress + "</li>");
  },

  // adding an address to the bidder's list
  newBidderSubscribed: function (bidderAddress) {
    $("#subscribedBiddersList").append("<li class='list-group-item'>" + bidderAddress + "</li>");
  },

  // notifying that the auction has been successfully deployed
  auctionDeployedSuccessfully: function (auctionAddress, auctionName, objectDesciption) {
    console.log("new auction create " + auctionName + " description " + objectDesciption);

    hideSpinnerNextTo("#deployContract");
    $("#newAuctionSubmitted").text("Success");
    $("#newAuctionSubmitted").show();

    $("#contractFunctionsCard").show();
  },

  // showing the winner address
  notifyWinner: function (winnerAddress, bid) {
    $("#notificationModalInfo").text(winnerAddress + " won bidding " + bid);
    $("#notificationModal").modal("toggle");
  }
}



