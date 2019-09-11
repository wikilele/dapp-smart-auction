pragma solidity ^0.4.22;

/**
 * This contract and it's code must be called inside a Auction contract
 */ 
contract SimpleEscrow{
    address winnerBidder; 
    address seller;
    address trustedThirdParty;
    address auctionContract;

    bool winnerBidderAccepted = false;
    bool sellerAccepted = false;
    bool thirdPartyAccepted = false;
    
    bool winnerBidderRefused = false;
    bool sellerRefused = false;

    bool escrowClosed = false;
    
    
    constructor (address _seller, address _bidder, address _trustedThirdParty) public payable {
        require(_seller != _bidder && _seller != _trustedThirdParty && _bidder != _trustedThirdParty);
        require(isContract(msg.sender));
        seller = _seller;
        winnerBidder = _bidder;
        trustedThirdParty = _trustedThirdParty;
        
        auctionContract = msg.sender;
    }
    modifier checkBalance(){
        require(address(this).balance > 0,"first you should send money");_;
    }
    
    
    modifier checkSender(){
        // only the creator can call the functions
        require(msg.sender == auctionContract);_;
    }
    
    function () public payable checkSender() checkBalance(){
        // only the creator can send the contended moneys
    }

    function accept(address addr) public checkSender() checkBalance() {
        if (addr == seller){
            require(sellerAccepted == false, "seller already accepted");
            require(sellerRefused == false, "seller has refused");

            sellerAccepted = true;
        } else if (addr == winnerBidder){
            require(winnerBidderAccepted == false, "winner bidder already accepted");
            require(winnerBidderRefused == false, "winner biddder has refused");

            winnerBidderAccepted = true;
        } else if(addr == trustedThirdParty){
            require(thirdPartyAccepted == false, "third party already accepted");
            
            thirdPartyAccepted = true;  
        } 
    }
    
    function refuse(address addr) public checkSender() {
        if (addr == seller) {
            require(sellerAccepted == false, "seller has accepted");
            require(sellerRefused == false, "seller already refused");
            sellerRefused = true;
        } else if (addr == winnerBidder){
            require(winnerBidderAccepted == false, "winner bidder has accepted");
            require(winnerBidderRefused == false, "winner biddder already refused");
            winnerBidderRefused = true;
        } 
    }
    
    function conclude() public checkSender() checkBalance(){
        require(escrowClosed == false,"escrow already closed");
        // gonna list all the possible cases
        if (sellerAccepted && winnerBidderAccepted)
            seller.transfer(address(this).balance);
        else if (sellerAccepted && thirdPartyAccepted)
            seller.transfer(address(this).balance);
        else if(winnerBidderAccepted && thirdPartyAccepted)
            winnerBidder.transfer(address(this).balance);
        
        else if (sellerRefused && winnerBidderRefused)
            winnerBidder.transfer(address(this).balance);
        
        escrowClosed = true;
    }
    
    // checking if the address is a contract address
    function isContract(address _addr) private view returns (bool){
        uint32 size;
        assembly{
             size := extcodesize(_addr)
        }
        return (size > 0);
    }
    
    // getters
    function getWinnerBidder() public view returns(address){
        return winnerBidder;
    }
    
    function getSeller() public view returns (address){
        return seller;
    }
    
    function getTrustedThirdParty()public view returns (address){
        return trustedThirdParty;
    } 


    function destroyContract() public {
        selfdestruct(msg.sender);
    }
}











