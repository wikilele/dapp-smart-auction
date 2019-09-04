$("#deployContract").click(function(){

    let strategy = $("#decreasingStrategy option:selected").text();
    let _reservePrice = $("#_reservePrice").val();
    let _initialPrice = $("#_initialPrice").val();
    let _openedForLength = $("#_openedForLength").val();
    let _seller = $("#_sellerAddress").val();
    let miningRate = $("#miningRate").val();

    AuctionHouse.deployContracts(strategy,_reservePrice,_initialPrice, _openedForLength, _seller, miningRate);
    
    
  });

$("#addBlock").click(function(){
    AuctionHouse.addBlock();
  })

$("#concludeEscrow").click(function(){
  AuctionHouse.concludeEscrow();
})

$("#auctionHouseContractAddressCopyBtn").click(function(){
  copyToClipboard("#auctionHouseContractAddress");
})


function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}