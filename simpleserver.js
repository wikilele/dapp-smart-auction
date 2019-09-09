var express = require('express');
var opn = require('opn');
var app = express();
const path = require('path');
const router = express.Router();

var auctionHouseContractAddress = "";

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
})

app.get("/auctionhouse/address",function(req,res){
    res.json({ contractAddress : auctionHouseContractAddress })
})

app.use(express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/build/contracts'));


app.use('/', router);
app.listen(process.env.port || 3002);

console.log('Running at Port 3002');

// opn("http://localhost:3002/");