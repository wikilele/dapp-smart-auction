// @return the defined user, it can be the auctionhouse or the bidder or the seller
function getUser() {
    if (typeof auctioneer !== 'undefined') return auctioneer;
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


// seller and bidder will periodically check if the AuctionHouse has been deployed
let addressDisplayed = false;
function checkForAuctionHouseAddress() {
    $.ajax({
        type: "GET",
        url: "auctionhouse/address",
        dataType: 'json',
        success: function (data) {

            if (data.contractAddress != "") {
                console.log(data.contractAddress);
                $("#auctionHouseAddress").text(data.contractAddress);
                hideSpinnerNextTo("#subscribeToAuctionHouse");
                $("#subscribeToAuctionHouse").show();
                addressDisplayed = true;
            }

        },
        complete: function () {
            if (addressDisplayed == false)
                setTimeout(checkForAuctionHouseAddress, 1000);
        }
    });
}

function changeViewBasedOn(auctionType){
    
    if (auctionType == "VickreyAuction"){     
        $(".vickrey").show(); // or attr diplay block
        $(".dutch").hide();
    } else {
        $(".vickrey").hide(); 
        $(".dutch").show();
    }
}

const alertHtml = function(text,type){
    return '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert"> <span> ' + text + 
            '</span> <button type="button" class="close" data-dismiss="alert" aria-label="Close"> <span aria-hidden="true">&times;</span> ' +
            '</button> </div>'; 
}  

function addAlertElement(text, type){
    $("#alertListDiv").append(alertHtml(text,type));
}

function toggleNotificationModal(text){
    $("#notificationModalInfo").text(text);   
    $("#notificationModal").modal("toggle");
}


// showing an alert if transaction fails
function notifyTransactionError(err) {
    toggleNotificationModal("Something went wrong! " + err);
}



// accepting the escrow, alert is showed if the transaction is reverted
var escrowAccepted = false;
$("#acceptEscrow").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            await user.auctionContract.acceptEscrow();
            escrowAccepted = true;
        } catch (err) {
            notifyTransactionError("transaction reverted");
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
            notifyTransactionError("transaction reverted");
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
            notifyTransactionError("transaction reverted");
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
            // console.log(err);
            notifyTransactionError("transaction reverted");
        }
    }
});

// alling the getGracePeiod on the deployed contract
// this function should be used to see if the auction is opened
$("#getGracePeriod").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        let gracep = await user.auctionContract.getGracePeriod();
        if (gracep <= 0) {
            $("#getGracePeriodSuccess").show();
            $("#getGracePeriodResult").hide();
        } else {
            $("#getGracePeriodResult").text(gracep.toString());
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
            $("#getOpenedForDanger").hide();
            $("#getOpenedForResult").text(openedfor.toString());
        } catch (err) {
            // console.log(err);
            $("#getOpenedForDanger").show();
            $("#getOpenedForResult").hide();
        }
    }
});


// calling getDepositRequired on the deployed contract
// alert is showed if the transaction is reverted
$("#getDepositRequired").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {

        let deposit = await user.auctionContract.getDepositRequired();
        $("#getDepositRequiredResult").text(deposit.toString());
    }
});


// calling getCommitmentPhaseLength on the deployed contract
// alert is showed if the transaction is reverted
$("#getCommitmentPhaseLength").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            let phasel = await user.auctionContract.getCommitmentPhaseLength();
            $("#getCommitmentPhaseLengthResult").text(phasel.toString());
            $("#getCommitmentPhaseLengthResult").show();
            $("#getCommitmentPhaseLengthDanger").hide();
        } catch (err) {
            // notifyTransactionError("transaction reverted");
            $("#getCommitmentPhaseLengthResult").hide();
            $("#getCommitmentPhaseLengthDanger").show();
        }

    }
});

// calling getWithdrawalPhaseLength on the deployed contract
// alert is showed if the transaction is reverted
$("#getWithdrawalPhaseLength").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            let phasel = await user.auctionContract.getWithdrawalPhaseLength();
            console.log("withdrawal length" + phasel);
            $("#getWithdrawalPhaseLengthResult").text(phasel.toString());
            $("#getWithdrawalPhaseLengthResult").show(); 
            $("#getWithdrawalPhaseLengthDanger").hide();

        } catch (err) {
            // notifyTransactionError("transaction reverted");
            $("#getWithdrawalPhaseLengthResult").hide();
            $("#getWithdrawalPhaseLengthDanger").show();
        }
    }
});

// calling getOpeningPhaseLength on the deployed contract
// alert is showed if the transaction is reverted
$("#getOpeningPhaseLength").click(async function () {
    let user = getUser();

    if (user != null && user.auctionContract != null) {
        try {
            let phasel = await user.auctionContract.getOpeningPhaseLength();
            $("#getOpeningPhaseLengthResult").text(phasel.toString());
            $("#getOpeningPhaseLengthResult").show();
            $("#getOpeningPhaseLengthDanger").hide();

        } catch (err) {
            // notifyTransactionError("transaction reverted");
            $("#getOpeningPhaseLengthResult").hide();
            $("#getOpeningPhaseLengthDanger").show();
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
            toggleNotificationModal("Before you must change the address to that one you selected at the beginning!");
        }
    });



//called when window loads
$(window).on('load', function () {
    $('[data-toggle="tooltip"]').tooltip(); //enablig tooltips

    $("#currentMetamaskAccount").text(ethereum.selectedAddress);

    // updating the displayed account every time it changes
    // if the account is selected, only that one willl be displayed
    ethereum.on('accountsChanged', function (accounts) {
        $("#currentMetamaskAccount").text(ethereum.selectedAddress);
    })

  
    if(ethereum.networkVersion  == 3) // ropsten
        $("#addBlockListElem").hide();
   
});