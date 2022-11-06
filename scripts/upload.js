const { ethers } = require("hardhat")

const TITLE = "DOC"

async function upload() {
    const docCollection = await ethers.getContract("DocCollection")
    const basicDoc = await ethers.getContract("BasicDoc")
    console.log("Uploading...")
    const uploadTx = await basicDoc.uploadDocument()
    const uploadTxReceipt = await uploadTx.wait(1)
    const tokenId = uploadTxReceipt.events[0].args.tokenId
    console.log("Approving Doument...")

    const approvalTx = await basicDoc.approve(docCollection.address, tokenId)
    await approvalTx.wait(1)
    console.log("Uploading Document...")

    const tx = await docCollection.uploadDoc(basicDoc.address, tokenId, TITLE)
    await tx.wait(1)
    console.log("Uploaded")
}

upload()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
