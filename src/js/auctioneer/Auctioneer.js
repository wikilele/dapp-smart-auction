// variable storing the auctionhouse (user) informations
var auctioneer = null;

class Auctioneer extends User { // auctioneer
    constructor() {
        super();
        this.decreasingStrategy = null;
        this.auctionHouse = null;
    }

    // deploying the Auction House contract
    async init() {
        this.auctionHouse = new AuctionHouse();
        let address = await this.auctionHouse.deploy(App.provider.getSigner());

        // diplaying the contract address
        auctioneerUI.setAuctionHouseAddress(address);

        // sending the auction house address to the server so that it can be taken by the bidder and the seller
        $.ajax({
            type: "POST",
            url: "auctionhouse/address",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ "contractAddress": address })
        })

        this.auctionHouse.registerToEvents(auctioneerUI);
    }

    // connecting to the deployed contract
    async connectToAuctionHouse(address) {
        this.auctionHouse = new AuctionHouse();
        await this.auctionHouse.connect(App.provider.getSigner(),address );

        this.auctionHouse.registerToEvents(auctioneerUI);
    }


    // deploying the Dutch Auction
    async initDutchAuction(strategy, _reservePrice, _initialPrice, _openedForLength, _seller, miningRate, _objectDesciption) {

        this.decreasingStrategy = new DecreasingStrategy(strategy);
        await this.decreasingStrategy.deploy(App.provider.getSigner());

        this.auctionContract = new DutchAuction();
        this.auctionContract.objectDesciption = _objectDesciption;
        
        await this.auctionContract.deploy(App.provider.getSigner(), _reservePrice, _initialPrice, _openedForLength, _seller, this.decreasingStrategy.strategy.address, miningRate);

        this.auctionContract.registerToEvents(auctioneerUI);
        
        this.auctionHouse.notifyNewAuction(this.auctionContract.contractAddress, this.auctionContract.type, this.auctionContract.objectDesciption);
    }

    async initVickreyAuction(_reservePrice, _commitmentPhaseLength,_withdrawalPhaseLength,_openingPhaseLength, _depositReuired, _seller, miningRate, _objectDesciption){

        this.auctionContract = new VickreyAuction();
        this.auctionContract.objectDesciption = _objectDesciption;
        
        await this.auctionContract.deploy(App.provider.getSigner(), _reservePrice, _commitmentPhaseLength,_withdrawalPhaseLength,_openingPhaseLength, _depositReuired, _seller, miningRate);

        this.auctionContract.registerToEvents(auctioneerUI);

        this.auctionHouse.notifyNewAuction(this.auctionContract.contractAddress, this.auctionContract.type, this.auctionContract.objectDesciption);
    }

    async finalize(){
        await this.auctionContract.finalize();
    }

    async destroyContracts() {
        await this.auctionContract.destroy();
        if (this.decreasingStrategy != null) 
            await this.decreasingStrategydestroy();
        await this.auctionHouse.destroy(); 

        $.ajax({
            type: "POST",
            url: "auctionhouse/address",
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({ "contractAddress": "" })
        })
    }
}

// called when the window loads
$(window).on('load', function () {
    auctioneer = new Auctioneer();
});






