var sellerUI = null

class SellerUI extends UserInterface {
    // AuctionHouse events
    newSellerSubscribed(sellerAddress) {
        if (sellerAddress.toLowerCase() == seller.pubKey) {
            // notify a successfull subscription to the AuctionHouse
            hideSpinnerNextTo("#subscribeToAuctionHouse");
            $("#subscribeToAuctionHouseSuccess").show();
            $("#submitCard").show();
        }
    }

    newBidderSubscribed(bidderAddress) { return; } // does nothing

    newAuctionSubmitted(sellerAddress, objectDescription) {
        if (sellerAddress.toLowerCase() == seller.pubKey) {
            // notify that the auction was successfully submitted
            hideSpinnerNextTo("#submitAuction");
            $("#submitAuctionSuccess").show();
        }
    }

    auctionDeployedSuccessfully(auctionAddress, auctionType, objectDesciption) {
        seller.notifyNewAuction(auctionAddress, auctionType, objectDesciption);
        
        changeViewBasedOn(auctionType);
        // showing the list of functions to interact with the contract
        $("#contractFunctionsCard").show();
    }

    // both Dutch and Vickrey events
    notifyWinner(winnerAddress, bid) {
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
        if(address.toLowerCase() == seller.pubKey){
            $("#acceptEscrowResultSuccess").show();
            $("#refuseEscrowListElem").hide();
        }    
    }

    // notify that the escrow has been refused
    escrowRefused(address) {
        if(address.toLowerCase() == seller.pubKey){
            $("#refuseEscrowResultSuccess").show();
            $("#acceptEscrowListElem").hide();
        }
    }

    // notify that the escrow has been concluded
    escrowClosed() {
        $("#concludeEscrowResultSuccess").show();

        $("#notificationModalInfo").text("Escrow Closed successfully");
        $("#notificationModal").modal("toggle");
    }

    // Dutch event
    notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice) { return; } // does nothing

    // Vickrey events

    notifyCommittedEnvelop(bidderAddress) {
        console.log("Envelop commited " + bidderAddress);
    }

    notifyWithdraw(bidderAddress) {
        console.log("Withdrawal " + bidderAddress);
    }

    notifyOpen(bidderAddress, value) {
        console.log("Open " + bidderAddress + " bid " + value);
    }

    notifyFirstBid(bidderAddress, value) {
        console.log("Open " + bidderAddress + " bid " + value);
    }

    notifySecondBid(bidderAddress, value) {
        console.log("Open " + bidderAddress + " bid " + value);
    }
}



// called when the window loads
$(window).on('load', function () {
    sellerUI = new SellerUI();
});