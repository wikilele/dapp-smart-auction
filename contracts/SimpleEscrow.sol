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
        if (addr == seller) sellerAccepted = true;
        else if (addr == winnerBidder) winnerBidderAccepted = true;
        else if (addr == trustedThirdParty) thirdPartyAccepted = true;
        
    }
    
    function refuse(address addr) public checkSender() {
        if (addr == seller) sellerRefused = true;
        else if (addr == winnerBidder) winnerBidderRefused = true;
        

    }
    
    function conclude() public checkSender() checkBalance(){
        // gonna list all the possible cases
        if (sellerAccepted && winnerBidderAccepted)
            seller.transfer(address(this).balance);
        else if (sellerAccepted && thirdPartyAccepted)
            seller.transfer(address(this).balance);
        else if(winnerBidderAccepted && thirdPartyAccepted)
            winnerBidder.transfer(address(this).balance);
        
        else if (sellerRefused && winnerBidderRefused)
            winnerBidder.transfer(address(this).balance);
        
        
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











