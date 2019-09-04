const auctionhousePrivateKey = "a0d9dab5fed44e095a2b021e2b4f87068b1d1488d9546eb6229a487f0885114c";


AuctionHouse = {
    auctionHouseContract: null,
    objectDescription: null,  // TODO handle this better
    dutchAuctionContract : null,
    decreasingStrategyContract: null,
    wallet: null,

    initWallet : function(){ 
        AuctionHouse.wallet = new ethers.Wallet( auctionhousePrivateKey, App.provider);
    },

    init: function(){
        AuctionHouse.initWallet();

        //deploying the AuctionHouse.sol contract
        (async function() {
            let auctionHouseJSON = await $.getJSON( "AuctionHouse.json");
            let auctionHouseFactory = new ethers.ContractFactory(auctionHouseJSON.abi, auctionHouseJSON.bytecode, AuctionHouse.wallet);
            AuctionHouse.auctionHouseContract = await auctionHouseFactory.deploy();

            await AuctionHouse.auctionHouseContract.deployed();

            console.log(AuctionHouse.auctionHouseContract.address);

            $("#auctionHouseContractAddress").text(AuctionHouse.auctionHouseContract.address);

            AuctionHouse.auctionHouseContract.on("NewSellerSubscribed",(sellerAddress) =>{
                $("#subscribedSellersList").append("<li class='list-group-item'>" + sellerAddress + "</li>");
            });

            AuctionHouse.auctionHouseContract.on("NewBidderSubscribed",(bidderAddress) =>{
                $("#subscribedBiddersList").append("<li class='list-group-item'>" + bidderAddress + "</li>");
            });

            AuctionHouse.auctionHouseContract.on("AuctionSubmitted",(sellerAddress, objectDescription) =>{
                $("#currentAuctionHeader").text("A new Auction has been submitted!");
                $("#currentAuctionObjectDescription").text(objectDescription);
                $("#_sellerAddress").val(sellerAddress);
                AuctionHouse.objectDescription = objectDescription;
            });


        })();
    },

    deployDecreasingStrategy : async function(strategy){
            // deploying the choosen strategy
            let decreasingStrategyJSON = await $.getJSON( strategy + "DecreasingStrategy.json");

            let decreasingStrategyFactory = new ethers.ContractFactory( decreasingStrategyJSON.abi, decreasingStrategyJSON.bytecode, AuctionHouse.wallet );
            
            AuctionHouse.decreasingStrategyContract = await decreasingStrategyFactory.deploy();
            
            await AuctionHouse.decreasingStrategyContract.deployed();

    },

    deployDutchAuction : async function(_reservePrice,_initialPrice, _openedForLength, _seller, miningRate){ 

            // deploying the DucthAcution
            let dutchAuction = await $.getJSON("DutchAuction.json");

            // Create an instance of a Contract Factory
            let factory = new ethers.ContractFactory( dutchAuction.abi, dutchAuction.bytecode, AuctionHouse.wallet);

            AuctionHouse.dutchAuctionContract = await factory.deploy(ethers.utils.parseEther(_reservePrice), ethers.utils.parseEther(_initialPrice), _openedForLength, _seller,  AuctionHouse.decreasingStrategyContract.address, miningRate);

            console.log(AuctionHouse.dutchAuctionContract.address);

            // The contract is NOT deployed yet; we must wait until it is mined
            await AuctionHouse.dutchAuctionContract.deployed()
            
            AuctionHouse.auctionHouseContract. notifyNewAuction(AuctionHouse.dutchAuctionContract.address,"DutchAuction", AuctionHouse.objectDescription);

            return AuctionHouse.registerEvents();

    },

    deployContracts: function(strategy, _reservePrice,_initialPrice, _openedForLength, _seller, miningRate){
        (async function() {
            await AuctionHouse.deployDecreasingStrategy(strategy);
            await AuctionHouse.deployDutchAuction(_reservePrice,_initialPrice, _openedForLength, _seller, miningRate);

        })();
    },


    registerEvents: function(){
        /*dutchAuctionContract.on("AuctionCreated", (availableIn) => { // TODO chek this first event
                console.log("Auction created!, available in " + availableIn);
        });*/

            AuctionHouse.dutchAuctionContract.on("NewBlock", (blocknumber) => {
            console.log("Block number " + blocknumber);
        });
    },

    addBlock : function(){
        AuctionHouse.dutchAuctionContract.addBlock();
    },

    concludeEscrow: function(){
        AuctionHouse.dutchAuctionContract.concludeEscrow();
    }

}





// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        AuctionHouse.init();
    });
});