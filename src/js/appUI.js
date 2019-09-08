function getUser(){
    if(typeof auctionhouse !== 'undefined') return auctionhouse;
    else if(typeof bidder !== 'undefined') return bidder;
    else if(typeof seller !== 'undefined') return seller;
    else {
        throw "No user is defined";
    }
}


$("#acceptEscrow").click(async function(){
    let user = getUser();

    if(user != null && user.auctionContract != null){
        try{
            await user.auctionContract.acceptEscrow();
        }catch(err){
            appUI.notifyTransactionError("transaction reverted");
        }    
    }
});


$("#refuseEscrow").click(async function(){
    let user = getUser();

    if(user != null && user.auctionContract != null){
        try{
            await user.auctionContract.refuseEscrow();
        }catch(err){
            appUI.notifyTransactionError("transaction reverted");
        } 
    }
});

$("#concludeEscrow").click(async function(){
    let user = getUser();

    if(user != null && user.auctionContract != null){
        try{
            await user.auctionContract.concludeEscrow();
        }catch(err){
            appUI.notifyTransactionError("transaction reverted");
        } 
    }
});

$("#getSeller").click(function(){
    let user = getUser();

    if(user != null && user.auctionContract != null){
         user.auctionContract.getSeller().then((seller)=>{
            $("#getSellerResult").text(seller);
        }); 
        
    }
});

$("#getReservePrice").click(function(){
    let user = getUser();

    if(user != null && user.auctionContract != null){
        user.auctionContract.getReservePrice().then((price)=>{
            $("#getReservePriceResult").text(price.toString());
        });       
    }
});

$("#getInitialPrice").click(function(){
    let user = getUser();

    if(user != null && user.auctionContract != null){
        user.auctionContract.getInitialPrice().then((price)=>{
            $("#getInitialPriceResult").text(price.toString());
        }); 
    }
});

$("#getCurrentPrice").click(async function(){
    let user = getUser();

    if(user != null && user.auctionContract != null){
        try{
            let price = await  user.auctionContract.getCurrentPrice()
            $("#getCurrentPriceResult").text(price.toString());
        }catch(err){
            
        }        
    }
});

$("#getOpenedFor").click(async function(){
    let user = getUser();

    if(user != null && user.auctionContract != null){
        try{
            let openedfor = await user.auctionContract.getOpenedFor();
            $("#getOpenedForResult").text(openedfor.toString());
        }catch(err){
            appUI.notifyTransactionError("transaction reverted");
        }
        
    }
});

$("#addBlock").click(function(){
    let user = getUser();

    if( user !== null && user.auctionContract !== null){
         user.auctionContract.addBlock();
    } else{
        console.log("auction not created yet");
    }
});

$("#metamaskAccountUsedBtn").click(function(){
    $("#metamaskAccountUsedBtn").hide();
    // from now on the displayed address won't change
    $("#currentMetamaskAccount").attr("id",ethereum.selectedAddress); 

    let user = getUser();
    user.pubKey = ethereum.selectedAddress.toLowerCase();
});



$(".btn")
    .not("#metamaskAccountUsedBtn")
    .not("#auctionHouseContractAddressCopyBtn")
    .not("#notificationModalDismissBtn")
    .mouseover(function(){
    let user = getUser();
    

    if(user.pubKey != null && user.pubKey != ethereum.selectedAddress.toLowerCase()){
        
        $("#notificationModalInfo").text("Before you must change the address to that one you selected at the beginning!");
        $("#notificationModal").modal("toggle");
    }
});


appUI = {
    notifyTransactionError: function(err){
        $("#notificationModalInfo").text("Something went wrong! (probably your transaction has been reverted)");
        $("#notificationModal").modal("toggle");
    }
}


$(window).on('load', function () {
    $('[data-toggle="tooltip"]').tooltip();
    
    $("#currentMetamaskAccount").text(ethereum.selectedAddress);

    ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        console.log("Account changed");
        $("#currentMetamaskAccount").text(ethereum.selectedAddress);

    }) 
});