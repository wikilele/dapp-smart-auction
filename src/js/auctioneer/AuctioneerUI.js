var auctioneerUI = null;

class AuctioneerUI extends UserInterface {
    // AuctionHouse events

    // adding an address to the sellers' list
    newSellerSubscribed(sellerAddress) {
        $("#subscribedSellersList").append("<li class='list-group-item'>" + sellerAddress + "</li>");
    }

    // adding an address to the bidder's list
    newBidderSubscribed(bidderAddress) {
        $("#subscribedBiddersList").append("<li class='list-group-item'>" + bidderAddress + "</li>");
    }

    // displaying the card to deploy a new auction
    newAuctionSubmitted(sellerAddress, objectDescription) {
        $("#auctionCard").show();
        $("#newAuctionSubmitted").show();

        $("#currentAuctionHeader").text("A new Auction has been submitted!");
        $("#currentAuctionObjectDescription").text(objectDescription);
        $("#_sellerAddress").val(sellerAddress);
    }

    auctionDeployedSuccessfully(auctionAddress, auctionName, objectDesciption) {
        console.log("new auction create " + auctionName + " description " + objectDesciption);

        hideSpinnerNextTo("#deployContract");
        $("#newAuctionSubmitted").text("Success");
        $("#newAuctionSubmitted").show();
    
        $("#contractFunctionsCard").show();
    }

    // both Dutch and Vickrey events
    notifyWinner(winnerAddress, bid) {
        $("#notificationModalInfo").text(winnerAddress + " won bidding " + bid);
        $("#notificationModal").modal("toggle");
    }

    // displaying the just added block number
    newBlock(blockNumber) {
        console.log("Block added " + blockNumber);
        $("#addBlockResult").text(blockNumber);
    }

    // notify that the escrow has been accepted
    escrowAccepted(address) {
        if(address.toLowerCase() == auctioneer.pubKey)
            $("#acceptEscrowResultSuccess").show();
    }

    // notify that the escrow has been refused
    escrowRefused(address) {
        if(address.toLowerCase() == auctioneer.pubKey)
            $("#refuseEscrowResultSuccess").show();
    }

    // notify that the escrow has been concluded
    escrowClosed() {
        $("#concludeEscrowResultSuccess").show();

        $("#notificationModalInfo").text("Escrow Closed successfully");
        $("#notificationModal").modal("toggle");

        // only visible to auctionhouse
        $("#destroyContractListElement").attr("display","block");
    }

    // Dutch event
    notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice) { return; } // does nothing

    // Vickrey events

    notifyCommittedEnvelop(bidderAddress) {
        throw "This function needs to be implemented in the subclasses";
    }

    notifyWithdraw(bidderAddress) {
        throw "This function needs to be implemented in the subclasses";
    }

    notifyOpen(bidderAddress, value) {
        throw "This function needs to be implemented in the subclasses";
    }

    notifyFirstBid(bidderAddress, value) {
        throw "This function needs to be implemented in the subclasses";
    }

    notifySecondBid(bidderAddress, value) {
        throw "This function needs to be implemented in the subclasses";
    }


    // new implemented methods

    // displaying the AuctionHouse contract's address
    setAuctionHouseAddress(address) {
        hideSpinnerNextTo("#auctionHouseContractAddressDeployBtn");
        $("#auctionHouseContractAddressCopyBtn").show();
        $("#auctionHouseContractAddress").text(address);
    }
}


// called when the window loads
$(window).on('load', function () {
    auctioneerUI = new AuctioneerUI();
});