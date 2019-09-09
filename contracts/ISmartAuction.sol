pragma solidity ^0.4.22;
import "./SimpleEscrow.sol";

contract ISmartAuction{
    uint256 reservePrice;
    address seller; 
    
    uint256 gracePeriod;

    address escrowTrustedThirdParty;
    SimpleEscrow simpleescrow;
    
    event EscrowAccepted(address subj);
    event EscrowRefused(address subj);
    event EscrowClosed();
    
    // testing related event
    event NewBlock(uint256 blockNum);
    
    function acceptEscrow() public;
    function refuseEscrow() public;
    function concludeEscrow() public;
    
    function getSeller() public view returns(address){
        return seller;
    }
        
    function getReservePrice() public view returns (uint256){
        return reservePrice;
    }

    // functions to know how many blocks are left to the end of each phase
    function getGracePeriod() public view returns(int){
        return  int(gracePeriod - block.number + 1);
    }
    
    /*
    * The function above are added only to test better the contract.
    * In a real environment they should be removed
    */
    function addBlock() public{
        emit NewBlock(block.number);
    }


    function destroyContract()public {
        simpleescrow.destroyContract();
        selfdestruct(escrowTrustedThirdParty);
    }
        
}