$("#subscribeToAuctionHouse").click(function(){
    
    let address = $("#auctionHouseAddress").val();
    Seller.subscribeToAuctionHouse(address);

    $("#subscribeToAuctionHouse").hide();
    $("#subscribeToAuctionHouseSuccess").show();

  });


$("#acceptEscrow").click(function(){
  Seller.acceptEscrow();
});

$(function() {
    $(window).on('load', function () {
       
    });
});


$("#submitAuction").click(function(){
    
    let objectDescription = $("#objectDescription").val();
    console.log(objectDescription);
    Seller.submitAuction(objectDescription);

    $("#submitAuction").hide();
    $("#submitAuctionSuccess").show();

  });


  $("#acceptEscrow").click(function(){
    App.acceptEscrow(Seller.dutchAuctionContract);
  });
  