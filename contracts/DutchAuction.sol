pragma solidity ^0.4.22;
import "./ISmartAuction.sol";
import "./DecreasingStrategies.sol";


contract DutchAuction is ISmartAuction{
    uint256 openedForLength;
    uint256 initialPrice;
  
    
    IDecreasingStrategy decrStratedy;
    
    // used for escrow
    address firstBidAddress;

    
    uint256 gracePeriod;
    bool bidSubmitted = false; 
    // events
    event AuctionCreated(uint32 availableIn); // getting the number of blocks corresponding to the grace period
    event NotEnoughMoney(address bidder, uint256 sent, uint256 price);
    event Winner(address winnerBidder, uint256 bid);
    
    
    constructor (uint256  _reservePrice,
                uint256 _initailPrice,
                uint256 _openedForLength,
                address _seller,
                IDecreasingStrategy _decrStratedy,
                uint32 miningRate) public{
            require(_seller != msg.sender);
            require(_initailPrice > _reservePrice && _reservePrice >= 0);
            
            openedForLength = _openedForLength;
            seller = _seller;
            initialPrice = _initailPrice;
            reservePrice = _reservePrice;
            
            decrStratedy = _decrStratedy;

            // the auction house will also be the trusted third party for the escrow
            escrowTrustedThirdParty = msg.sender;
            
            // miningRate == 15 means that on average one block is mined every 15 seconds
            gracePeriod = block.number + 5*60 / miningRate; 
            
            
            emit AuctionCreated( 5*60 / miningRate);
            
        }
        
        modifier checkPeriod(){
            require(gracePeriod < block.number && block.number <= gracePeriod + openedForLength + 1, "not int the bid phase");_;
        }
        
        
        
        function bid() public payable checkPeriod(){
            require(msg.sender != seller && msg.sender != escrowTrustedThirdParty);
            require(bidSubmitted == false, "someone else has already bidded");
            uint256 currentPrice = decrStratedy.getCurrentPrice(block.number - gracePeriod - 1, openedForLength, initialPrice, reservePrice);
            
            if(msg.value >= currentPrice){
                bidSubmitted = true;
                firstBidAddress = msg.sender;
                emit Winner(msg.sender, msg.value);
                simpleescrow = new SimpleEscrow(seller,firstBidAddress,escrowTrustedThirdParty);
                address(simpleescrow).transfer(msg.value);
            } else {
                // sending the money back
                emit NotEnoughMoney(msg.sender,msg.value, currentPrice);
                msg.sender.transfer(msg.value);
            }
        }

        // escrow related wrappers
        modifier checkEscrowSender(){
            require(msg.sender == seller || msg.sender == firstBidAddress || msg.sender == escrowTrustedThirdParty);_;
        }
        
        function acceptEscrow() public checkEscrowSender(){
            require(bidSubmitted == true, "bid not submitted");
            
            simpleescrow.accept(msg.sender);
            emit EscrowAccepted(msg.sender);
        }
        
        function refuseEscrow() public  checkEscrowSender(){
            require(bidSubmitted == true);
            
            simpleescrow.refuse(msg.sender);
            
            emit EscrowRefused(msg.sender);
        }
        
        function concludeEscrow() public{
            require(bidSubmitted == true);
            // only the trusted third party can conclude
            require(msg.sender == escrowTrustedThirdParty);
            
            simpleescrow.conclude();
            
            emit EscrowClosed();
        }
        
        // getter

        
        function getInitialPrice() public view returns(uint256){
            return initialPrice;
        }
        
        function getCurrentPrice() public view checkPeriod() returns(uint256){
            return decrStratedy.getCurrentPrice(block.number - gracePeriod - 1, openedForLength, initialPrice, reservePrice );
        }
        
        // getting the remaning number of block the auction will be opened for
        function getOpenedFor() public view checkPeriod returns(uint256){
            return gracePeriod + openedForLength - block.number + 1;
        }
        
 
        
    }    
        
        
        
        
        
        
