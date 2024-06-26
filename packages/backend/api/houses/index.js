'use strict';

const { web3Factory } = require("../../utils/web3");
const { BN, CHAIN_ID, REAL_ESTATE_ADDRESS, REAL_ESTATE_ABI } = require("../../constants");
const web3 = web3Factory(CHAIN_ID);

// CONTRACTS //
const RealEstate = new web3.eth.Contract(REAL_ESTATE_ABI, REAL_ESTATE_ADDRESS)

// generates: random integer.
function getRandomInt(max, min) {
    const randInt 
        = Math.floor(Math.random() * max) < min ? min.toString()
            : (Math.floor(Math.random() * max)).toString()
    return Number(randInt).toString()
}

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
    const nowTime = Math.floor(Number(Date.now()) / 1000)
    const daysPassed =  Math.floor((nowTime - createTime) / 86_400)

    // pricing info //
    const listPrice = Number(houseInfo.listPrice)
    const latestValue = Number(listPrice) + (Number(daysPassed) * 1_000) // adds: $1000 daily to the list price.
 
    // metadata //
    const squareFootage = houseInfo.squareFootage
    const homeAddress = houseInfo.homeAddress
    const bedRooms = houseInfo.bedRooms
    const bathRooms = houseInfo.bathRooms

        return {
            "id": tokenId,
            "listPrice": listPrice,
            "homeAddress": homeAddress,
            "latestValue": latestValue,
            "squareFootage": squareFootage,
            "bedRooms": bedRooms,
            "bathRooms": bathRooms,
            "daysPassed": daysPassed,
            "needsUpdate": daysPassed > 0,
        }
}

async function infos(ctx) {
    ctx.body = (await getInfo(ctx))
}

async function houseInfo(ctx) {
    ctx.body = (await getHouseInfo(ctx))
}

module.exports = { infos, issuedInfo, houseInfo };