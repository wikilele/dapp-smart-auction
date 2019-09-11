var bidderUI = null;

class BidderUI extends UserInterface {
    // AuctionHouse events
    newSellerSubscribed(sellerAddress) { return; } // does nothing

    newBidderSubscribed(bidderAddress) {
        if (bidderAddress.toLowerCase() == bidder.pubKey) {
            // notify the user of a successful subscription to the AuctionHouse contract
            hideSpinnerNextTo("#subscribeToAuctionHouse");
            $("#subscribeToAuctionHouseSuccess").show();
        }
    }

    newAuctionSubmitted(sellerAddress, objectDescription) {
        console.log("A new auction has been submitted by a seller. object: " + objectDescription);
    }

    auctionDeployedSuccessfully(auctionAddress, auctionType, objectDesciption) {
        
        bidder.notifyNewAuction(auctionAddress, auctionType, objectDesciption);
        // showing the modal to join the new auction
        $("#contractAddressModal").text(auctionAddress);
        $("#auctionTypeModal").text(auctionType);
        $("#objectDescriptionModal").text(objectDesciption);
        $("#auctionCreatedModal").modal("toggle");
    }

    // both Dutch and Vickrey events
    notifyWinner(winnerAddress, bid) {
        // showing the winner
        hideSpinnerNextTo("#bidButton");
        console.log(winnerAddress + " won bidding " + bid);

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
        if(address.toLowerCase() == bidder.pubKey)
            $("#acceptEscrowResultSuccess").show();
    }

    // notify that the escrow has been refused
    escrowRefused(address) {
        if(address.toLowerCase() == bidder.pubKey)
            $("#refuseEscrowResultSuccess").show();
    }

    // notify that the escrow has been concluded
    escrowClosed() {
        $("#concludeEscrowResultSuccess").show();

        $("#notificationModalInfo").text("Escrow Closed successfully");
        $("#notificationModal").modal("toggle");
    }

    // Dutch event

    notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice) {
        
        if (bidderAddress.toLowerCase() == bidder.pubKey) {
            // telling the user that his bid wasn't enough
            hideSpinnerNextTo("#bidButton");
            $("#bidButton").show();
            console.log("You bidded " + bidSent + " but the actual price was " + actualPrice);
            $("#notificationModalInfo").text("You bidded " + bidSent + " but the actual price was " + actualPrice);
        
            $("#notificationModal").modal("toggle");
        }
    }

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
}


// called when the window loads
$(window).on('load', function () {
    bidderUI = new BidderUI();
});