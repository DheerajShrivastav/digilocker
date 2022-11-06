const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        :VERIFICATION_BLOCK_CONFIRMATIONS
        console.log("-------------------------------------");
        const arguments = []
        const docCollection = await deploy("DocCollection", {
            from: deployer,
            args: arguments,
            log: true,
            waitConfirmations: waitBlockConfirmations,
        })

        if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
            console.log("Verfying...");
            await verify(docCollection.address, arguments)

        }
        console.log("-------------------------------------");

}
module.exports.tags = ["all", "docCollection"]

