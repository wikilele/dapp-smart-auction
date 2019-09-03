var assert = require('assert');

const DutchAuction = artifacts.require("DutchAuction");

contract("DutchAuction", accounts => {
    it("test the correctness of the functions", async () => { // async function
    // Retrieve the last instance of DutchAuction
    const instance = await DutchAuction.deployed(); // await
    const result = await instance.getInitialPrice(); // await
    console.log("The result is " + result);
    assert(result == 5);
    });
});