$("#auctionHouseContractAddressDeployBtn").click(function(){
  $("#auctionHouseContractAddressDeployBtn").hide();
  $("#auctionHouseContractAddressDeployBtn").next().show(); // showing spinner
  $("#auctionHouseContractAddress").text("");

  auctionhouse.init();
})

$("#deployContract").click(function(){

    $("#deployContract").next().show();
    $("#deployContract").hide();
    $("#newAuctionSubmitted").hide();

    // choose her the kind of contract
    let strategy = $("#decreasingStrategy option:selected").text();
    let _reservePrice = $("#_reservePrice").val();
    let _initialPrice = $("#_initialPrice").val();
    let _openedForLength = $("#_openedForLength").val();
    let _seller = $("#_sellerAddress").val();
    let miningRate = $("#miningRate").val();

    auctionhouse.initDutchAuction( strategy,_reservePrice,_initialPrice, _openedForLength, _seller, miningRate);

  });


$("#auctionHouseContractAddressCopyBtn").click(function(){
  copyToClipboard("#auctionHouseContractAddress");

});


function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();


}

auctionhouseUI = {
  setAuctionHouseAddress: function(address){

    $("#auctionHouseContractAddressDeployBtn").next().hide();
    $("#auctionHouseContractAddressCopyBtn").show();
    $("#auctionHouseContractAddress").text(address);
  },

  newAuctionSubmitted : function(sellerAddress,objectDescription){
    $("#auctionCard").show();
    $("#newAuctionSubmitted").show();

    $("#currentAuctionHeader").text("A new Auction has been submitted!");
    $("#currentAuctionObjectDescription").text(objectDescription);
    $("#_sellerAddress").val(sellerAddress); 

  
  },

  newSellerSubscribed: function(sellerAddress){
    $("#subscribedSellersList").append("<li class='list-group-item'>" + sellerAddress + "</li>");
  },

  newBidderSubscribed: function(bidderAddress){
    $("#subscribedBiddersList").append("<li class='list-group-item'>" + bidderAddress + "</li>");
  },


  auctionDeployedSuccessfully: function(auctionAddress, auctionName, objectDesciption){
    console.log("new auction create " + auctionName + " description " + objectDesciption);
    $("#deployContract").next().hide();
    $("#newAuctionSubmitted").text("Success");
    $("#newAuctionSubmitted").show();

    $("#contractFunctionsCard").show();
  },

  notifyWinner: function(winnerAddress, bid){
    console.log(winnerAddress + " won bidding " + bid );

    $("#notificationModalInfo").text(winnerAddress + " won bidding " + bid);
    $("#notificationModal").modal("toggle");
  },

  newBlock: function(blockNumber){
    console.log("Block added " + blockNumber);
    $("#addBlockResult").text(blockNumber);
  },


  escrowAccepted: function(){
    console.log("Escrow Accepted!");
    $("#acceptEscrowResultSuccess").show();
  },
  escrowRefused: function(){
    console.log("Escrow Refused!");
    $("#refuseEscrowResultSuccess").show();
    
  },

  escrowClosed: function(){
    console.log("Escrow Closed!");
    $("#concludeEscrowResultSuccess").show();

    $("#notificationModalInfo").text("Escrow Closed successfully");

    $("#notificationModal").modal("toggle");
  }
}



// Call init whenever the window loads
$(function() {
  $(window).on('load', function () {
    
    $('[data-toggle="tooltip"]').tooltip()

  });
});
