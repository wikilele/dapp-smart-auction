class UserInterface{
    // AuctionHouse events
    newSellerSubscribed(sellerAddress){
        throw "This function needs to be implemented in the subclasses";
    }

    newBidderSubscribed(bidderAddress){
        throw "This function needs to be implemented in the subclasses";
    }

    newAuctionSubmitted(sellerAddress, objectDescription){
        throw "This function needs to be implemented in the subclasses";
    }

    auctionDeployedSuccessfully(auctionAddress, auctionName, objectDesciption){
        throw "This function needs to be implemented in the subclasses";
    }

    // both Dutch and Vickrey events
    notifyWinner(winnerAddress, bid){
        throw "This function needs to be implemented in the subclasses";
    }

    newBlock(blockNumber){
        throw "This function needs to be implemented in the subclasses";
    }

    escrowAccepted(address){
        throw "This function needs to be implemented in the subclasses";
    }

    escrowRefused(address){
        throw "This function needs to be implemented in the subclasses";
    }

    escrowClosed(){
        throw "This function needs to be implemented in the subclasses";
    }

    // Dutch event
    notifyNotEnoughMoney(bidderAddress, bidSent, actualPrice){
        throw "This function needs to be implemented in the subclasses";
    }

    // Vickrey events

    notifyCommittedEnvelop(bidderAddress){
        throw "This function needs to be implemented in the subclasses";
    }

    notifyWithdraw(bidderAddress){
        throw "This function needs to be implemented in the subclasses";
    }

    notifyOpen(bidderAddress, value){
        throw "This function needs to be implemented in the subclasses";
    }

    notifyFirstBid(bidderAddress,value){
        throw "This function needs to be implemented in the subclasses";
    }

    notifySecondBid(bidderAddress,value){
        throw "This function needs to be implemented in the subclasses";
    }
}