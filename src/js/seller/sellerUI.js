$("#metamaskAccountUsedBtn").click(function(){
  $("#subscribeToAuctionHouseCard").show();
});

$("#subscribeToAuctionHouse").click(function(){
  $("#subscribeToAuctionHouse").hide();
  $("#subscribeToAuctionHouse").next().show();


  let address = $("#auctionHouseAddress").val();
  seller.subscribeToAuctionHouse(address);   

  });


$("#submitAuction").click(function(){

    $("#submitAuction").hide();
    $("#submitAuction").next().show(); //showing spinner
    
    let objectDescription = $("#objectDescription").val();
    console.log(objectDescription);
    seller.submitAuction(objectDescription);

  });


  sellerUI = {

    successfullySubscribed: function(){
      $("#subscribeToAuctionHouse").next().hide();
      $("#subscribeToAuctionHouseSuccess").show();
      $("#submitCard").show();
    },

    auctionSuccessfullySubmitted: function(){
      $("#submitAuction").next().hide();
      $("#submitAuctionSuccess").show();
    },

    newAuction: function(){
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


$(function() {
  $(window).on('load', function () {

  });
});
