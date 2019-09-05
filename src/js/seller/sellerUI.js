$("#subscribeToAuctionHouse").click(function(){
    
    let address = $("#auctionHouseAddress").val();
    seller.subscribeToAuctionHouse(address);

    $("#subscribeToAuctionHouse").hide();
    $("#subscribeToAuctionHouseSuccess").show();

  });


$("#submitAuction").click(function(){
    
    let objectDescription = $("#objectDescription").val();
    console.log(objectDescription);
    seller.submitAuction(objectDescription);

    $("#submitAuction").hide();
    $("#submitAuctionSuccess").show();

  });

