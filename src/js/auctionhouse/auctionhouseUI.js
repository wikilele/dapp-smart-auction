$("#deployContract").click(function(){
    // choose her the kind of contract
    let strategy = $("#decreasingStrategy option:selected").text();
    let _reservePrice = $("#_reservePrice").val();
    let _initialPrice = $("#_initialPrice").val();
    let _openedForLength = $("#_openedForLength").val();
    let _seller = $("#_sellerAddress").val();
    let miningRate = $("#miningRate").val();

    auctionhouse.initDutchAuction( strategy,_reservePrice,_initialPrice, _openedForLength, _seller, miningRate);

  });


$("#addBlock").click(function(){
    auctionhouse.auctionContract.addBlock();
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
8
