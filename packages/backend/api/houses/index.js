'use strict';

const { web3Factory } = require("../../utils/web3");
const { BN, CHAIN_ID, BROKERAGE_ADDRESS, BROKERAGE_ABI } = require("../../constants");
const web3 = web3Factory(CHAIN_ID);

// CONTRACTS //
const Brokerage = new web3.eth.Contract(BROKERAGE_ABI, BROKERAGE_ADDRESS)

async function getInfo() {
    const totalHouses = new BN(await Brokerage.methods.totalHouses().call())
    // const totalHouses = new BN(_totalHouses.toString())
        return {
            "totalHouses": totalHouses,
        }
}

async function getHouseInfo(ctx) {
    const id = ctx.params.id
    // const houseInfo = await Brokerage.methods.getHouseInfo(houseAddress).call()
    const listPrice = '761167'
    const originalPrice = '770747'
    const taxValue = '729187'

        return {
            "id": id,
            "listPrice": listPrice,
            "originalPrice": originalPrice,
            "taxValue": taxValue,
        }
}

async function infos(ctx) {
    ctx.body = (await getInfo(ctx))
}

async function houseInfo(ctx) {
    ctx.body = (await getHouseInfo(ctx))
}

module.exports = { infos, houseInfo };