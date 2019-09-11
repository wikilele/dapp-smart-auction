App = {

    provider : null,
    url: 'http://localhost:8545',

    initProvider : function() {

        // connecting to the provider
        if(typeof web3 != 'undefined') { // Check whether exists a provider, e.g Metamask
            // connecting to Metamask
            App.provider = new ethers.providers.Web3Provider(web3.currentProvider); 
            try {
                // Permission popup
                ethereum.enable().then(async() => { console.log("DApp connected " );});
            }
            catch(error) { console.log(error); }
        } else { // Otherwise, create a new local instance of Web3
            let currentProvider = new web3.providers.HttpProvider(App.url);
            App.provider = new ethers.providers.Web3Provider(currentProvider);
        }
    },
}


class User{
    constructor(){
        this.pubKey = null;
        this.auctionContract = null;
        this.auctionHouseContract = null;
    }

}


// called when the window loads
$(window).on('load', function () {
    App.initProvider();
});
