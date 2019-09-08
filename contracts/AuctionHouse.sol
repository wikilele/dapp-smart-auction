pragma solidity ^0.4.22;


contract AuctionHouse{
    address auctioneerAddress;
    mapping(address => bool) subscribedSellers;
    mapping(address => bool) subscribedBidders;
    
    event NewAuction(address auctionAddress, string auctionName, string objectDesciption );
    event NewSellerSubscribed(address sellerAddress);
    event NewBidderSubscribed(address bidderAddress);
    event AuctionSubmitted(address sellerAddress, string objectDesciption);
    
    
    constructor () public payable{       
        auctioneerAddress = msg.sender;
    }
    
    
    function notifyNewAuction(address auctionAddress, string auctionName, string objectDesciption) public{
        require(msg.sender == auctioneerAddress,"only auctioneer can call this");
        emit NewAuction(auctionAddress, auctionName, objectDesciption);
    }
    
    function subscribeAsSeller() public {
        require(subscribedSellers[msg.sender] != true,"already subscribed");
        subscribedSellers[msg.sender] = true;
        
        emit NewSellerSubscribed(msg.sender);
    }


    function subscribeAsBidder() public {
        require(subscribedBidders[msg.sender] != true,"already subscribed");
        subscribedBidders[msg.sender] = true;
        
        emit NewBidderSubscribed(msg.sender);
    }
    
    // here we can pass other parameters like the reserve price, the inital price etc...
    function submitAuction(string objectDescription) public {
        require(subscribedSellers[msg.sender] == true,"seller not subscribed");
        
        emit AuctionSubmitted(msg.sender, objectDescription);
    }
    
    
}