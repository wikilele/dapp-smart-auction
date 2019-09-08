// @return the defined user, it can be the auctionhouse or the bidder or the seller
function getUser() {
    if (typeof auctionhouse !== 'undefined') return auctionhouse;
    else if (typeof bidder !== 'undefined') return bidder;
    else if (typeof seller !== 'undefined') return seller;
    else {
        throw "No user is defined";
    }
}

// showing/hiding a spinner next to the passed element
function showSpinnerNextTo(element) {
    $(element).next().show();
}
function hideSpinnerNextTo(element) {
    $(element).next().hide();
}

// accepting the escrow, alert is showed if the transaction is reverted
$("#acceptEscrow").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            await user.auctionContract.acceptEscrow();
        } catch (err) {
            appUI.notifyTransactionError("transaction reverted");
        }
    }
});

// refusing the escrow, alert is showed if the transaction is reverted
$("#refuseEscrow").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            await user.auctionContract.refuseEscrow();
        } catch (err) {
            appUI.notifyTransactionError("transaction reverted");
        }
    }
});

// concluding the escrow, alert is showed if the transaction is reverted
$("#concludeEscrow").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            await user.auctionContract.concludeEscrow();
        } catch (err) {
            appUI.notifyTransactionError("transaction reverted");
        }
    }
});

// calling getSeller on the deployed contract
$("#getSeller").click(function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        user.auctionContract.getSeller().then((seller) => {
            $("#getSellerResult").text(seller);
        });

    }
});

// calling getReservePrice on the deployed contract
$("#getReservePrice").click(function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        user.auctionContract.getReservePrice().then((price) => {
            $("#getReservePriceResult").text(price.toString());
        });
    }
});

// calling getInitialPrice on the deployed contract
$("#getInitialPrice").click(function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        user.auctionContract.getInitialPrice().then((price) => {
            $("#getInitialPriceResult").text(price.toString());
        });
    }
});

// calling getCurrentPrice on the deployed contract
// alert is showed if the transaction is reverted
$("#getCurrentPrice").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            let price = await user.auctionContract.getCurrentPrice()
            $("#getCurrentPriceResult").text(price.toString());
        } catch (err) {
            appUI.notifyTransactionError("transaction reverted");
        }
    }
});

// calling getOpenedFor on the deployed contract
// alert is showed if the transaction is reverted
$("#getOpenedFor").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            let openedfor = await user.auctionContract.getOpenedFor();
            $("#getOpenedForResult").text(openedfor.toString());
        } catch (err) {
            appUI.notifyTransactionError("transaction reverted");
        }

    }
});

// calling add block
// the block added will be notified by an event on the blockchain
$("#addBlock").click(function () {
    let user = getUser();

    if (user !== null && user.auctionContract !== null) {
        user.auctionContract.addBlock();
    } else {
        console.log("auction not created yet");
    }
});

// select the metamask's account you will use in that web page
// if you are cliking a button with a different account, an alert message will notify you 
$("#metamaskAccountUsedBtn").click(function () {
    $("#metamaskAccountUsedBtn").hide();
    // from now on the displayed address won't change
    $("#currentMetamaskAccount").attr("id", ethereum.selectedAddress);

    let user = getUser();
    user.pubKey = ethereum.selectedAddress.toLowerCase();
});

// showing tha alert message to notify the user to be consistent using the accounts
$(".btn")
    .not("#metamaskAccountUsedBtn")
    .not("#auctionHouseContractAddressCopyBtn")
    .not("#notificationModalDismissBtn")
    .mouseover(function () {
        let user = getUser();

        if (user.pubKey != null && user.pubKey != ethereum.selectedAddress.toLowerCase()) {

            $("#notificationModalInfo").text("Before you must change the address to that one you selected at the beginning!");
            $("#notificationModal").modal("toggle");
        }
    });


appUI = {
    // showing an alert if transaction fails
    notifyTransactionError: function (err) {
        $("#notificationModalInfo").text("Something went wrong! (probably your transaction has been reverted)");
        $("#notificationModal").modal("toggle");
    },

    // displaying the just added block number
    newBlock: function (blockNumber) {
        console.log("Block added " + blockNumber);
        $("#addBlockResult").text(blockNumber);
    },

    // notify that the escrow has been accepted
    escrowAccepted: function () {
        $("#acceptEscrowResultSuccess").show();
    },

    // notify that the escrow has been refused
    escrowRefused: function () {
        $("#refuseEscrowResultSuccess").show();
    },

    // notify that the escrow has been concluded
    escrowClosed: function () {
        $("#concludeEscrowResultSuccess").show();

        $("#notificationModalInfo").text("Escrow Closed successfully");
        $("#notificationModal").modal("toggle");
    }
}

//called when window loads
$(window).on('load', function () {
    $('[data-toggle="tooltip"]').tooltip(); //enablig tooltips

    $("#currentMetamaskAccount").text(ethereum.selectedAddress);

    // updating the displayed account every time it changes
    // if the account is selected, only that one willl be displayed
    ethereum.on('accountsChanged', function (accounts) {
        $("#currentMetamaskAccount").text(ethereum.selectedAddress);
    })
});