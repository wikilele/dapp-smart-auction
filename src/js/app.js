App = {

    contracts : {},
    provider : null,
    url: 'http://localhost:8545',

    initProvider : function() {

        // connecting to the provider
        let currentProvider = new web3.providers.HttpProvider(App.url);

        App.provider = new ethers.providers.Web3Provider(currentProvider);

    }
}


// Call init whenever the window loads
$(function() {
    $(window).on('load', function () {
        App.initProvider();
    });
});