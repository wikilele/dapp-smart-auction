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

        addAlertElement("<strong>" + winnerAddress + "</strong>  won!","success");
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

        addAlertElement("Escrow Closed successfully","success");
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
}



// called when the window loads
$(window).on('load', function () {
    sellerUI = new SellerUI();
});