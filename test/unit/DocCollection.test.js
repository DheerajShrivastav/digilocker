const { assert, expert } = require("chai")
const {network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
? describe.skip
: describe("Doc Collection Unit Test", function (){
    let docCollection, docCollectionContract
    const TITLE = "DOC"
    const Token_Id = 0

    
})