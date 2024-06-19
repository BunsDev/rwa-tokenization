'use strict';

const { web3Factory } = require("../../utils/web3");
const { BN, CHAIN_ID, REAL_ESTATE_ADDRESS, REAL_ESTATE_ABI } = require("../../constants");
const web3 = web3Factory(CHAIN_ID);

// CONTRACTS //
const RealEstate = new web3.eth.Contract(REAL_ESTATE_ABI, REAL_ESTATE_ADDRESS)

// generates: random integer.
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function getInfo() {
    const totalHouses = new BN(await RealEstate.methods.totalHouses().call())
    // const totalHouses = new BN(_totalHouses.toString())
        return {
            "totalHouses": totalHouses,
        }
}

async function issueHouseInfo(ctx) {
    const id = Number(ctx.params.id)

    // pricing info //
    const listPrice = getRandomInt(1_000_000)
    const originalPrice = getRandomInt(listPrice)
    const taxValue = Math.floor(originalPrice + listPrice / 2 * 0.825)
    
    // metadata (`random`) //
    const streetNumber = id * 1234 + 13
    const streetName = id % 2 == 0 ? `Easy Street` : id % 7 == 0 ? `Marine Avenue` : id % 13 == 0 ? `Chain Boulevard` : `Slinky Place`
    
    // metadata (`static`) //
    const homeAddress = `${streetNumber} ${streetName}`
    const yearBuilt = 2024 - id
    const squareFootage = id == 0 ? 3000 : id * 1113

        return {
            "id": id,
            "listPrice": listPrice,
            "originalPrice": originalPrice,
            "taxValue": taxValue,
            "homeAddress": homeAddress,
            "yearBuilt": yearBuilt,
            "squareFootage": squareFootage,
        }
}

// todo: make this into information that is stored on the blockchain
async function getHouseInfo(ctx) {
    const id = Number(ctx.params.id)

    // pricing info //
    const listPrice = getRandomInt(1_000_000)
    const originalPrice = getRandomInt(listPrice)
    const taxValue = Math.floor(originalPrice + listPrice / 2 * 0.825)
    
    // metadata (`random`) //
    const streetNumber = id * 1234 + 13
    const streetName = id % 2 == 0 ? `Easy Street` : id % 7 == 0 ? `Marine Avenue` : id % 13 == 0 ? `Chain Boulevard` : `Slinky Place`
    
    // metadata (`static`) //
    const homeAddress = `${streetNumber} ${streetName}`
    const yearBuilt = 2024 - id
    const squareFootage = id == 0 ? 3000 : id * 1113

        return {
            "id": id,
            "listPrice": listPrice,
            "originalPrice": originalPrice,
            "taxValue": taxValue,
            "homeAddress": homeAddress,
            "yearBuilt": yearBuilt,
            "squareFootage": squareFootage,
        }
}

async function infos(ctx) {
    ctx.body = (await getInfo(ctx))
}

async function issuedInfo(ctx) {
    ctx.body = (await issueHouseInfo(ctx))
}
async function houseInfo(ctx) {
    ctx.body = (await getHouseInfo(ctx))
}

module.exports = { infos, issuedInfo, houseInfo };