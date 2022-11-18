// const {
//     frontEndContractsFile,
//     frontEndContractsFile2,
//     frontEndAbiLocation,
//     frontEndAbiLocation2,
// } = require("../helper-hardhat-config")
require("dotenv").config()
const fs = require("fs")
const { network } = require("hardhat")
const frontEndContractsFile = "../frontend-doc-collection/constants/networkMapping.json"
const frontEndAbiLocation = "../frontend-doc-collection/constants/"

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const docCollection = await ethers.getContract("DocCollection")
    fs.writeFileSync(
        `${frontEndAbiLocation}docCollection.json`,
        docCollection.interface.format(ethers.utils.FormatTypes.json)
    )
    // fs.writeFileSync(
    //     `${frontEndAbiLocation2}docCollection.json`,
    //     docCollection.interface.format(ethers.utils.FormatTypes.json)
    // )

    const basicDoc = await ethers.getContract("BasicDoc")
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicDoc.json`,
        basicDoc.interface.format(ethers.utils.FormatTypes.json)
    )
    // fs.writeFileSync(
    //     `${frontEndAbiLocation2}BasicDoc.json`,
    //     basicDoc.interface.format(ethers.utils.FormatTypes.json)
    // )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const docCollection = await ethers.getContract("DocCollection")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["DocCollection"].includes(docCollection.address)) {
            contractAddresses[chainId]["DocCollection"].push(docCollection.address)
        }
    } else {
        contractAddresses[chainId] = { DocCollection: [docCollection.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
    // fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "frontend"]
