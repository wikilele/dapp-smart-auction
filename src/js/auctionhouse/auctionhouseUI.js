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
    $("#auctionHouseContractAddress").text(address);
  },

  newAuctionSubmitted : function(sellerAddress,objectDescription){
    $("#deployContract").show();
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
  },

  notifyWinner: function(winnerAddress, bid){
    console.log(winnerAddress + " won bidding " + bid );
  },

  newBlock: function(blockNumber){
    console.log("Block added " + blockNumber);
  }
}


$("#test").click(function(){
  auctionhouseUI.newSellerSubscribed("0x123");
})


// Call init whenever the window loads
$(function() {
  $(window).on('load', function () {
    $("#deployContract").hide();

  });
});
