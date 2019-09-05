const auctionhousePrivateKey = "a0d9dab5fed44e095a2b021e2b4f87068b1d1488d9546eb6229a487f0885114c";

let auctionhouse = null;

class AuctionHouse extends User{
    constructor(privateKey){
        super(privateKey);
        
    }

    async init(){
        let auctionHouseJSON = await $.getJSON( "AuctionHouse.json");
        let auctionHouseFactory = new ethers.ContractFactory(auctionHouseJSON.abi, auctionHouseJSON.bytecode, this.wallet);
        this.auctionHouseContract = await auctionHouseFactory.deploy();

        await this.auctionHouseContract.deployed();

        console.log(this.auctionHouseContract.address);

        $("#auctionHouseContractAddress").text(this.auctionHouseContract.address);

        return this.registerToAuctionHouseEvents();        
    }


    async initDutchAuction( strategy,_reservePrice,_initialPrice, _openedForLength, _seller, miningRate ){

        let decreasingStrategy = new DecreasingStrategy(strategy);
        await decreasingStrategy.deploy(this.wallet);

        await this.auctionContract.deploy(this.wallet,_reservePrice,_initialPrice, _openedForLength, _seller, decreasingStrategy.strategy.address, miningRate);

        this.auctionHouseContract.notifyNewAuction(this.auctionContract.contractAddress, this.auctionContract.type, "this.auctionContract.objectDesciption");

        return this.registerToAuctionEvents();

    }

    registerToAuctionHouseEvents(){

        this.auctionHouseContract.on("NewSellerSubscribed",(sellerAddress) =>{
                $("#subscribedSellersList").append("<li class='list-group-item'>" + sellerAddress + "</li>");
        });

        this.auctionHouseContract.on("NewBidderSubscribed",(bidderAddress) =>{
                $("#subscribedBiddersList").append("<li class='list-group-item'>" + bidderAddress + "</li>");
        });

        this.auctionHouseContract.on("AuctionSubmitted",(sellerAddress, objectDescription) =>{
            this.auctionContract = new DutchAuction();
            this.auctionContract.objectDesciption = objectDescription;
            $("#currentAuctionHeader").text("A new Auction has been submitted!");
            $("#currentAuctionObjectDescription").text(objectDescription);
            $("#_sellerAddress").val(sellerAddress);          
        });

        this.auctionHouseContract.on("NewAuction",(auctionAddress, auctionName, objectDesciption) =>{
            console.log("new auction create " + auctionName + " description " + objectDesciption);
        });
    }

    registerToAuctionEvents(){
        this.auctionContract.contract.on("Winner",(winnerAddress, bid)=>{
            console.log(winnerAddress + " won bidding " + bid );
        });

        this.auctionContract.contract.on("NewBlock",(blockNumber)=>{
            console.log("Block added " + blockNumber);
        });
    }
}

// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        auctionhouse = new AuctionHouse(auctionhousePrivateKey);
        auctionhouse.init();
    });
});





