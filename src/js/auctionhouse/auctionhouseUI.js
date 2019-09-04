$("#deployContract").click(function(){

    let strategy = $("#decreasingStrategy option:selected").text();
    let _reservePrice = $("#_reservePrice").val();
    let _initialPrice = $("#_initialPrice").val();
    let _openedForLength = $("#_openedForLength").val();
    let _seller = $("#_sellerAddress").val();
    let miningRate = $("#miningRate").val();

    AuctionHouse.deployContracts(strategy,_reservePrice,_initialPrice, _openedForLength, _seller, miningRate);
    
    
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

$("#acceptEscrow").click(function(){
  App.acceptEscrow(AuctionHouse.dutchAuctionContract);
});


$("#refuseEscrow").click(function(){
  App.refuseEscrow(AuctionHouse.dutchAuctionContract);
});


$("#concludeEscrow").click(function(){
  App.concludeEscrow(AuctionHouse.dutchAuctionContract);
});


$("#addBlock").click(function(){
  App.addBlock(AuctionHouse.dutchAuctionContract);
});

$("#getSeller").click(function(){
  App.getSeller(AuctionHouse.dutchAuctionContract);
});

$("#getReservePrice").click(function(){
  App.getReservePrice(AuctionHouse.dutchAuctionContract);
});

$("#getInitialPrice").click(function(){
  App.getInitialPrice(AuctionHouse.dutchAuctionContract);
});


$("#getCurrentPrice").click(function(){
  App.getCurrentPrice(AuctionHouse.dutchAuctionContract);
});

$("#getOpenedFor").click(function(){
  App.getOpenedFor(AuctionHouse.dutchAuctionContract);
});