pragma solidity ^0.4.22;

import "./ISmartAuction.sol";


contract VickreyAuction is ISmartAuction{
    // length of each of the 3 phases expressed in mined blocks
    uint256 commitmentPhaseLength;
    uint256 withdrawalPhaseLength;
    uint256 openingPahseLength;
    // finalize function can be called only one time
    bool finalizeCalled = false;
    uint256 depositRequired;
    mapping(address => uint256) commitedEnvelops;
    
    uint256 firstBid;
    address firstBidAddress;
    uint256 secondBid;
    address secondBidAddress;
    
    // events
    event AuctionCreated(uint32 availableIn); // getting the number of blocks corresponding to the grace period
    event CommittedEnvelop(address bidderAddress);
    event Withdraw(address leavingBidderAddress);
    event Open(address bidderAddress, uint256 value);
    event FirstBid(address bidderAddress, uint256 value);
    event SecondBid(address bidderAddress, uint256 value);
    
    
    constructor (uint256  _reservePrice,
                uint256 _commitmentPhaseLength,
                uint256 _withdrawalPhaseLength,
                uint256 _openingPahseLength,
                uint256 _depositRequired,
                address _seller,
                uint32 miningRate) public{
            require(_seller != msg.sender, "the seller can't create the auction");
            // the deposit must be at least two times the reservePrice
            require(_depositRequired >= 2*_reservePrice,"deposit must be >= 2*reservePrice");
            
            seller = _seller;
            reservePrice = _reservePrice;
            commitmentPhaseLength = _commitmentPhaseLength;
            withdrawalPhaseLength = _withdrawalPhaseLength;
            openingPahseLength = _openingPahseLength;
           
            depositRequired = _depositRequired;    
            // the auction house will also be the trusted third party for the escrow
            escrowTrustedThirdParty = msg.sender;
            
            // miningRate == 15 means that on average one block is mined every 15 seconds
            gracePeriod = block.number + 5*60 / miningRate; 
            
            /**
            * Since the first bid is init to reservePrice the bidder to win has to al least offer reservePrice + 1
            * The semantic is not perfect, but keeping it in this way allows the code to be more clean
            */
            secondBid = firstBid = reservePrice; 
            secondBidAddress = firstBidAddress = this;
            
            emit AuctionCreated( 5*60 / miningRate);
            
        }


        modifier checkCommitmentPahseLenght(){
            require(gracePeriod < block.number &&
                        block.number <= gracePeriod + commitmentPhaseLength, "not in commitment phase");_;
        }
        modifier checkWithdrawalPhaseLength(){
            require(gracePeriod + commitmentPhaseLength < block.number &&
                        block.number <= gracePeriod + commitmentPhaseLength + withdrawalPhaseLength, "not in withdrawal phase" );_;
        }
        modifier checkOpeningPahseLength(){
            require(gracePeriod + commitmentPhaseLength + withdrawalPhaseLength < block.number &&
                        block.number <= gracePeriod + commitmentPhaseLength + withdrawalPhaseLength + openingPahseLength, "not in opening phase");_;
        }
        modifier checkAuctionEnd(){
            require(gracePeriod + commitmentPhaseLength + withdrawalPhaseLength + openingPahseLength < block.number, "auction not ended");_;
        }
        
 
        function commitBid( uint256 envelop) external payable checkCommitmentPahseLenght(){ 
            require(msg.sender != escrowTrustedThirdParty,"escrow third party can't commit bid");
            // the seller can't bid
            require(msg.sender != seller, "seller can't commit bid");
            // won't keeep the actual deposit given,  the sender should send the right ammount 
            require(msg.value >= depositRequired, "need to send the deposit" );
            // the bidder can't bid more than one time
            require(commitedEnvelops[msg.sender] == 0, "you already called this function");
            
            commitedEnvelops[msg.sender] = envelop;
            emit CommittedEnvelop(msg.sender);
        }
        
        
        function withdraw() external checkWithdrawalPhaseLength(){

            if (commitedEnvelops[msg.sender] != 0){
                // this avoids to call the function multiple times
                commitedEnvelops[msg.sender] = 0;
                msg.sender.transfer(depositRequired/2);
                emit Withdraw(msg.sender);
            }
        }
        
        
        function open(uint256 nonce) external payable checkOpeningPahseLength(){
            // checking if the bid and the evelop match
            uint256 tmphash = uint256(keccak256(msg.value, nonce));
            // the last condition is useful to a avoid a fake withdraw: a bidder can bid 0 then open to get the deposit back 
            require((commitedEnvelops[msg.sender] == tmphash) && (msg.value >= reservePrice), "haven't sent the right ammount" );
            
            // to avoid more calls of the function from the same bidder
            commitedEnvelops[msg.sender] = 0;
            emit Open(msg.sender, msg.value);
            
            uint256 oldSecondBid;
            address oldSecondBidAddress;
            if(msg.value > firstBid){
                oldSecondBid = secondBid;
                oldSecondBidAddress = secondBidAddress;
                
                // first bid will become the secondBid, the old second bidder will be refounded
                secondBid = firstBid;
                secondBidAddress = firstBidAddress;
                emit SecondBid(secondBidAddress, secondBid);
                    
                firstBid = msg.value;
                firstBidAddress = msg.sender;
                emit FirstBid(msg.sender, msg.value);
                
                // prefer first to set the values and then to transfer the money
                if (oldSecondBid > reservePrice)
                    oldSecondBidAddress.transfer(oldSecondBid + depositRequired);
                
            }else if (msg.value > secondBid) {
                oldSecondBid = secondBid;
                oldSecondBidAddress = secondBidAddress;
                
                secondBid = msg.value;
                secondBidAddress = msg.sender;
                emit SecondBid(msg.sender, msg.value);
                
                if (oldSecondBid > reservePrice)
                    oldSecondBidAddress.transfer(oldSecondBid + depositRequired);
            
            }else
                msg.sender.transfer(msg.value + depositRequired);
        }
        
        
        function finalize() public checkAuctionEnd(){
            require(finalizeCalled == false, "finalize function already called");
            // only the auction house can call this
            require(msg.sender == escrowTrustedThirdParty, "only the auction house can call this function");
            finalizeCalled = true;
            
            if(firstBid == reservePrice) // noone has betted
                return;
                
            // TIE RESOLUTION RULE if there is a tie the first one who opened the envelop wins
            if (secondBid != reservePrice)
                secondBidAddress.transfer(secondBid + depositRequired);
            
            // the winner pays the ammount offered by the second winner
            emit Winner(firstBidAddress, firstBid);
            firstBidAddress.transfer(firstBid - secondBid + depositRequired);
            
              //burning remaining ether
            address burnAddress = 0x0;
            burnAddress.transfer(address(this).balance - secondBid);

            //seller.transfer(secondBid);
            simpleescrow = new SimpleEscrow(seller,firstBidAddress,escrowTrustedThirdParty);
            address(simpleescrow).transfer(secondBid);
        }
        
        // escrow related wrappers
        modifier checkEscrowSender(){
            require(msg.sender == seller || msg.sender == firstBidAddress || msg.sender == escrowTrustedThirdParty);_;
        }
        
        function acceptEscrow() public checkAuctionEnd() checkEscrowSender(){
            require(finalizeCalled == true);
            
            simpleescrow.accept(msg.sender);

            emit EscrowAccepted(msg.sender);
        }
        
        function refuseEscrow() public checkAuctionEnd() checkEscrowSender(){
            require(finalizeCalled == true);
            
            simpleescrow.refuse(msg.sender);

            emit EscrowRefused(msg.sender);
        }
        
        function concludeEscrow() public checkAuctionEnd(){
            require(finalizeCalled == true);
            // only the trusted third party can conclude
            require(msg.sender == escrowTrustedThirdParty);
            
            simpleescrow.conclude();

            emit EscrowClosed();
        }
        
        // getters

        
        function getDepositRequired() public view returns(uint256){
            return depositRequired;
        }
        
        // function getTrustedThirdParty() public view returns(address){
        //     return escrowTrustedThirdParty;
        // }
        
        
        function getCommitmentPhaseLength() public view  checkCommitmentPahseLenght() returns(uint256){
            return gracePeriod + commitmentPhaseLength - block.number;
        }
        
        function getWithdrawalPhaseLength() public view  checkWithdrawalPhaseLength() returns(uint256){
            return gracePeriod + commitmentPhaseLength + withdrawalPhaseLength - block.number;
        }
        
        function getOpeningPhaseLength() public view checkOpeningPahseLength() returns(uint256){
            return gracePeriod + commitmentPhaseLength + withdrawalPhaseLength + openingPahseLength - block.number;
        }
        

        /*
        * Can be used to retrive the hash to be passed to the open function
        */
        function doKeccak(uint256 value, uint256 nonce) external pure returns(uint256) {
            return uint256(keccak256(value,nonce));
        }
        
}

