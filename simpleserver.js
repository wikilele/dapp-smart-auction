var express = require('express');
var app = express();
const path = require('path');
const router = express.Router();

// variables keeping the state of the server
var auctionHouseContractAddress = "";
var subscribedSellers = [];
var subscribedBidders = [];

app.use(express.json());

app.get("/",function(req,res){
    res.sendFile( path.join(__dirname+'/src/index.html'));
})

app.get("/auctionhouse",function(req,res){
    res.sendFile( path.join(__dirname+'/src/auctionhouse.html'));
})

app.get("/bidder",function(req,res){
    res.sendFile( path.join(__dirname+'/src/bidder.html'));
})

app.get("/seller",function(req,res){
    res.sendFile( path.join(__dirname+'/src/seller.html'));
})

app.post("/auctionhouse/address",function(req,res){
    auctionHouseContractAddress = req.body.contractAddress;
    console.log(auctionHouseContractAddress);
    
    if(auctionHouseContractAddress == ""){
        // resetting the lists
        subscribedBidders = [];
        subscribedSellers = [];
    }

    res.sendStatus(200);
})

app.get("/auctionhouse/address",function(req,res){
    res.json({ contractAddress : auctionHouseContractAddress });
})

// managing subscribed sellers and bidders if AuctionHouse already deployed
app.post("/auctionhouse/:address/seller",function(req,res){
    if(req.params.address == auctionHouseContractAddress){
        sellerAddress = req.body.sellerAddress;
        
        if(subscribedSellers.includes(sellerAddress) == false){
            console.log("new seller " + sellerAddress);
            subscribedSellers.push(sellerAddress);
        }

        res.sendStatus(200);
    }
})

app.post("/auctionhouse/:address/bidder",function(req,res){
    if(req.params.address == auctionHouseContractAddress){
        bidderAddress = req.body.bidderAddress;
        
        if(subscribedBidders.includes(bidderAddress) == false){
            console.log("new bidder " + bidderAddress);
            subscribedBidders.push(bidderAddress);
        }
        res.sendStatus(200);
    }
})

app.get("/auctionhouse/subscribedsellers",function(req,res){
    res.json({ sellers : subscribedSellers });
})

app.get("/auctionhouse/subscribedbidders",function(req,res){
    res.json({ bidders : subscribedBidders });
})





app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/build/contracts'));


app.use('/', router);
app.listen(process.env.port || 3002);

console.log('Running at Port 3002');
console.log('http://localhost:3002/');

