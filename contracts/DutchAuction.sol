pragma solidity ^0.4.22;
import "./SimpleEscrow.sol";
import "./DecreasingStrategies.sol";


contract DutchAuction{
    uint256 openedForLength;
    uint256 initialPrice;
    uint256 reservePrice;
    address seller; 
    
    IDecreasingStrategy decrStratedy;
    
    // used for escrow
    address firstBidAddress;
    address escrowTrustedThirdParty;
    SimpleEscrow simpleescrow;
    
    uint256 gracePeriod;
    bool bidSubmitted = false; 
    // events
    event AuctionCreated(uint32 availableIn); // getting the number of blocks corresponding to the grace period
    event NotEnoughMoney(address bidder, uint256 sent, uint256 price);
    event Winner(address winnerBidder, uint256 bid);
    
    // testing related event
    event NewBlock(uint256 blockNum);

    
    constructor (uint256  _reservePrice,
                uint256 _initialPrice,
                uint256 _openedForLength,
                address _seller,
                IDecreasingStrategy _decrStratedy,
                uint32 miningRate) public{
            require(_seller != msg.sender, "_seller must be different from auction deployer");
            require(_initialPrice > _reservePrice && _reservePrice >= 0);
            
            openedForLength = _openedForLength;
            seller = _seller;
            initialPrice = _initialPrice;
            reservePrice = _reservePrice;
            
            decrStratedy = _decrStratedy;

            // the auction house will also be the trusted third party for the escrow
            escrowTrustedThirdParty = msg.sender;
            
            // miningRate == 15 means that on average one block is mined every 15 seconds
            gracePeriod = block.number + 5*60 / miningRate; 
            
            
            emit AuctionCreated( 5*60 / miningRate);
            
        }
        
        modifier checkPeriod(){
            require(gracePeriod < block.number && block.number <= gracePeriod + openedForLength, "not int the bid phase");_;
        }
        
        
        
        function bid() public payable checkPeriod(){
            require(msg.sender != seller && msg.sender != escrowTrustedThirdParty);
            require(bidSubmitted == false, "someone else has already bidded");
            uint256 currentPrice = decrStratedy.getCurrentPrice(block.number - gracePeriod, openedForLength, initialPrice, reservePrice);
            
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
            require(bidSubmitted == true);
            
            simpleescrow.accept(msg.sender);
        }
        
        function refuseEscrow() public  checkEscrowSender(){
            require(bidSubmitted == true);
            
            simpleescrow.refuse(msg.sender);
        }
        
        function concludeEscrow() public{
            require(bidSubmitted == true);
            // only the trusted third party can conclude
            require(msg.sender == escrowTrustedThirdParty);
            
            simpleescrow.conclude();
        }
        
        // getter
        function getSeller() public view returns(address){
            return seller;
        }
        
        function getReservePrice() public view returns (uint256){
            return reservePrice;
        }
        
        function getInitialPrice() public view returns(uint256){
            return initialPrice;
        }
        
        function getCurrentPrice() public view checkPeriod() returns(uint256){
            return decrStratedy.getCurrentPrice(block.number- gracePeriod, openedForLength, initialPrice, reservePrice );
        }
        
        // getting the remaning number of block the auction will be opened for
        function getOpenedFor() public view checkPeriod returns(uint256){
            return gracePeriod + openedForLength - block.number;
        }
        
        // test purposes only
         function addBlock() public {
            emit NewBlock(block.number);
        }
        
    }    
        
        
        
        
        
        
