var auctioneerUI = null;

class AuctioneerUI extends UserInterface {
    // AuctionHouse events

    // adding an address to the sellers' list
    newSellerSubscribed(sellerAddress) {
        $("#subscribedSellersList").append("<li class='list-group-item'>" + sellerAddress + "</li>");
        $.ajax({
            type: "POST",
            url: "auctionhouse/" + auctioneer.auctionHouse.contract.address  + "/seller",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ "sellerAddress": sellerAddress })
        })
    }

    // adding an address to the bidder's list
    newBidderSubscribed(bidderAddress) {
        $("#subscribedBiddersList").append("<li class='list-group-item'>" + bidderAddress + "</li>");
        $.ajax({
            type: "POST",
            url: "auctionhouse/" + auctioneer.auctionHouse.contract.address  + "/bidder",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ "bidderAddress": bidderAddress })
        })
    }

    // displaying the card to deploy a new auction
    newAuctionSubmitted(sellerAddress, objectDescription) {
        $("#auctionCard").show();
        $("#newAuctionSubmitted").text("New");
        $("#newAuctionSubmitted").show();

        $("#currentAuctionHeader").text("A new Auction has been submitted!");
        $("#currentAuctionObjectDescription").text(objectDescription);
        $("#_sellerAddress").val(sellerAddress);
    }

    auctionDeployedSuccessfully(auctionAddress, auctionType, objectDesciption) {
        console.log("new auction create " + auctionType + " description " + objectDesciption);
        
        changeViewBasedOn(auctionType);

        hideSpinnerNextTo("#deployContract");
        $("#newAuctionSubmitted").text("Success");
        $("#newAuctionSubmitted").show();
    
        $("#contractFunctionsCard").show();
    }

    // both Dutch and Vickrey events
    notifyWinner(winnerAddress, bid) {
        addAlertElement("<strong>" + winnerAddress + "</strong> won!","success");

        if(auctioneer.auctionContract.type == "VickreyAuction"){
            $("#finalizeSuccess").show();
        }
    }

    // displaying the just added block number
    newBlock(blockNumber) {
        console.log("Block added " + blockNumber);
        $("#addBlockResult").text(blockNumber);
    }

    // notify that the escrow has been accepted
    escrowAccepted(address) {
        if(address.toLowerCase() == auctioneer.pubKey){
            $("#acceptEscrowResultSuccess").show();
            $("#refuseEscrowListElem").hide();
        }    
    }

    // notify that the escrow has been refused
    escrowRefused(address) {
        if(address.toLowerCase() == auctioneer.pubKey){
            $("#refuseEscrowResultSuccess").show();
            $("#acceptEscrowListElem").hide();
        }
    }

    // notify that the escrow has been concluded
    escrowClosed() {
        $("#concludeEscrowResultSuccess").show();

        addAlertElement("Escrow Closed successfully","success");

        // only visible to auctionhouse
        $("#destroyContractListElement").show();
    }

    // Dutch event
    notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice) { return; } // does nothing

    // Vickrey events

    notifyCommittedEnvelop(bidderAddress) {
        addAlertElement("Envelop committed by <strong>" + bidderAddress + "</strong>","secondary");
        console.log("Envelop commited " + bidderAddress);
    }

    notifyWithdraw(bidderAddress) {
        console.log("Withdrawal " + bidderAddress);
        addAlertElement("Withdrawal by by <strong>" + bidderAddress + "</strong>","secondary");
    }

    notifyOpen(bidderAddress, value) {
        console.log("Open " + bidderAddress + " bid " + value);
        addAlertElement("<strong>" + bidderAddress + "</strong> opened the envelop","secondary");
    }

    notifyFirstBid(bidderAddress, value) {
        console.log("First bid " + bidderAddress + " bid " + value);
        addAlertElement("First bid <strong>" + bidderAddress + "</strong> bid <strong>" + value + "</strong>" ,"secondary");
    }

    notifySecondBid(bidderAddress, value) {
        console.log("second bid " + bidderAddress + " bid " + value);
        addAlertElement("Second bid <strong>" + bidderAddress + "</strong> bid <strong>" + value + "</strong>" ,"secondary");
    }


    // new implemented methods

    // displaying the AuctionHouse contract's address
    setAuctionHouseAddress(address) {
        hideSpinnerNextTo("#auctionHouseContractAddressDeployBtn");

        $("#auctionHouseContractAddress").text(address);
    }
}


// called when the window loads
$(window).on('load', function () {
    auctioneerUI = new AuctioneerUI();
});