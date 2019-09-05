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
    },

    auctionSuccessfullySubmitted: function(){
      $("#submitAuction").next().hide();
      $("#submitAuctionSuccess").show();
    },

    notifyWinner: function(winnerAddress, bid){
      console.log(winnerAddress + " won bidding " + bid );
    },

    newBlock: function(blockNumber){
      console.log("Block added " + blockNumber);
    },

    escrowAccepted: function(){
      console.log("Escrow Accepted!");
    },
    escrowRefused: function(){
      console.log("Escrow Refused!");
    },

    escrowClosed: function(){
      console.log("Escrow Closed!");
    }

  }
