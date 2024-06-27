'use strict';

const { web3Factory } = require("../../utils/web3");
const { BN, CHAIN_ID, REAL_ESTATE_ADDRESS, REAL_ESTATE_ABI } = require("../../constants");
const web3 = web3Factory(CHAIN_ID);

// CONTRACTS //
const RealEstate = new web3.eth.Contract(REAL_ESTATE_ABI, REAL_ESTATE_ADDRESS)

async function getInfo() {
    const totalHouses = new BN(await RealEstate.methods.totalHouses().call())
    // const totalHouses = new BN(_totalHouses.toString())
        return {
            "totalHouses": totalHouses,
        }
}


// todo: make this into information that is stored on the blockchain
async function getHouseInfo(ctx) {
    const id = Number(ctx.params.id)
    const tokenId = id.toString()
    const houseInfo = await RealEstate.methods.houseInfo(tokenId).call()

    // time refactoring //
    const createTime = Number(houseInfo.createTime)
    const latestUpdate = RealEstate.methods.latestUpdate(tokenId).call()
    const nowTime = Math.floor(Number(Date.now()) / 1000)
    const hoursPassed = Math.floor((nowTime - createTime) / 3_600)
    const hoursSinceLastRefresh = Math.floor((nowTime - latestUpdate) / 3_600)
    const needsUpdate = hoursSinceLastRefresh >= 1

    // pricing info //
    const listPrice = Number(houseInfo.listPrice)
    const latestValue = needsUpdate ? Number(listPrice) + (Number(hoursPassed) * 10) : Number(listPrice) // adds: $10 every hour to the list price.
 
    // metadata //
    const homeAddress = houseInfo.homeAddress
    const squareFootage = houseInfo.squareFootage

        return {
            "id": tokenId,
            "listPrice": listPrice,
            "homeAddress": homeAddress,
            "latestValue": latestValue,
            "squareFootage": squareFootage,
            "hoursPassed": hoursPassed,
            "needsUpdate": needsUpdate
        }
}

async function infos(ctx) {
    ctx.body = (await getInfo(ctx))
}

async function houseInfo(ctx) {
    ctx.body = (await getHouseInfo(ctx))
}

module.exports = { infos, houseInfo };